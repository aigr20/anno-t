import { inject, InjectionToken, Service, type Provider } from "@angular/core";
import {
  catchError,
  filter,
  map,
  merge,
  Observable,
  of,
  shareReplay,
  Subject,
  switchMap,
  throwError,
} from "rxjs";

export interface Migration {
  /** Versionen som migrationen resulterar i.. */
  readonly version: number;
  readonly migrate: (db: IDBDatabase, tx: IDBTransaction) => void;
}

export interface IndexedDBConfig {
  dbName: string;
  version: number;
  migrations: Migration[];
}

export const INDEXED_DB_CONFIG = new InjectionToken<IndexedDBConfig>("IndexedDBConfig");

export function provideIndexedDBConfig(config: IndexedDBConfig): Provider {
  return {
    provide: INDEXED_DB_CONFIG,
    useValue: config,
  };
}

export type DBOjectStores = Record<string, StoreDefinition>;

export type StoreDefinition = {
  value: unknown;
  key: IDBValidKey;
  indices?: readonly IndexDefinition[];
};

export type AutoIncrementStoreDefinition = { keyName: string } & StoreDefinition;

type IndicesOf<S> = S extends {
  indices: (infer I extends IndexDefinition)[];
}
  ? I
  : never;

export type IndexName<S> =
  IndicesOf<S> extends {
    name: infer N extends string;
  }
    ? N
    : never;

export type IndexKey<S, N extends IndexName<S>> =
  Extract<IndicesOf<S>, { name: N }> extends {
    value: infer K;
  }
    ? K
    : never;

export type IndexDefinition = {
  name: string;
  value: unknown;
};

type ValidSchema<S> = {
  [N in keyof S]: S[N] extends { value: infer V; key: infer K extends IDBValidKey }
    ? StoreDefinition
    : never;
};

export type DefineSchema<S extends ValidSchema<S>> = S;

@Service()
export class IndexedDBService<DBSchema extends DBOjectStores = DBOjectStores> {
  private readonly db$: Observable<IDBDatabase>;
  private readonly write$: Subject<keyof DBSchema>;
  private readonly config;

  constructor() {
    this.config = inject(INDEXED_DB_CONFIG);
    this.db$ = this.openDatabase();
    this.write$ = new Subject();
  }

  private openDatabase(): Observable<IDBDatabase> {
    return new Observable<IDBDatabase>((observer) => {
      const request = indexedDB.open(this.config.dbName, this.config.version);

      request.onupgradeneeded = (event) => {
        const db = request.result;
        const oldVersion = event.oldVersion;
        const newVersion = event.newVersion ?? this.config.version;

        console.log(`Migrating IndexedDB from version ${oldVersion} to version ${newVersion}`);

        this.config.migrations
          .filter((migration) => migration.version > event.oldVersion)
          .sort((a, b) => a.version - b.version)
          .forEach((migration) => {
            console.log(`Migrating to target version ${migration.version}`);
            migration.migrate(db, (event.target as IDBRequest<unknown>).transaction!);
          });
      };

      request.onsuccess = () => {
        const db = request.result;

        console.log(`${db.name} version ${db.version} ready`);
        observer.next(db);
        observer.complete();
      };

      request.onerror = () => observer.error(request.error);
      request.onblocked = () => observer.error(new Error("Database blocked"));
    }).pipe(
      catchError((err) => throwError(() => new Error(`Failed to open DB: ${err.message}`))),
      shareReplay(1),
    );
  }

  private execute<T>(
    storeName: string,
    mode: IDBTransactionMode,
    action: (store: IDBObjectStore) => IDBRequest<T>,
    emitWrite: boolean = true,
  ): Observable<T> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable<T>((observer) => {
          try {
            const tx = db.transaction(storeName, mode);
            const store = tx.objectStore(storeName);
            const request = action(store);

            request.onsuccess = () => observer.next(request.result);
            request.onerror = () => observer.error(request.error);

            tx.oncomplete = () => {
              if (emitWrite && mode === "readwrite") {
                this.write$.next(storeName);
              }
              observer.complete();
            };
            tx.onabort = () => observer.error(new Error("Transaction aborted"));
            tx.onerror = () => observer.error(tx.error);
          } catch (e) {
            observer.error(e);
          }
        });
      }),
    );
  }

  add<S extends keyof DBSchema>(
    storeName: S,
    value: DBSchema[S]["value"],
  ): Observable<DBSchema[S]["key"]> {
    return this.execute(storeName as string, "readwrite", (store) => store.add(value));
  }

  put<S extends keyof DBSchema>(
    storeName: S,
    value: DBSchema[S]["value"],
  ): Observable<DBSchema[S]["key"]> {
    return this.execute(storeName as string, "readwrite", (store) => store.put(value));
  }

  get<S extends keyof DBSchema>(
    storeName: S,
    key: DBSchema[S]["key"],
  ): Observable<DBSchema[S]["value"] | undefined> {
    return this.execute(storeName as string, "readonly", (store) => store.get(key), false);
  }

  getByIndex<S extends keyof DBSchema, I extends IndexName<DBSchema[S]>>(
    storeName: S,
    indexName: I,
    query: (IndexKey<DBSchema[S], I> & IDBValidKey) | IDBKeyRange,
  ): Observable<DBSchema[S]["value"] | undefined> {
    return this.execute(storeName as string, "readonly", (store) => {
      const index = store.index(indexName as string);
      return index.get(query);
    });
  }

  getAll<S extends keyof DBSchema>(
    storeName: S,
    query?: IDBValidKey | IDBKeyRange,
    count?: number,
  ): Observable<DBSchema[S]["value"][]> {
    return this.execute(
      storeName as string,
      "readonly",
      (store) => store.getAll(query, count),
      false,
    );
  }

  getAllIndex<S extends keyof DBSchema, I extends IndexName<DBSchema[S]>>(
    storeName: S,
    indexName: I,
    query: (IndexKey<DBSchema[S], I> & IDBValidKey) | IDBKeyRange,
    count?: number,
  ): Observable<DBSchema[S]["value"][]> {
    return this.db$.pipe(
      switchMap((db) => {
        return new Observable<DBSchema[S]["value"][]>((observer) => {
          try {
            const tx = db.transaction(storeName as string, "readonly");
            const store = tx.objectStore(storeName as string);
            const index = store.index(indexName);
            const request = index.getAll(query, count);

            request.onsuccess = () => observer.next(request.result);
            request.onerror = () => observer.error(request.error);

            tx.oncomplete = () => observer.complete();
            tx.onabort = () => observer.error(new Error("Transaction was aborted"));
            tx.onerror = () => observer.error(tx.error);
          } catch (error) {
            observer.error(error);
          }
        });
      }),
    );
  }

  delete<S extends keyof DBSchema>(storeName: S, key: DBSchema[S]["key"]): Observable<void> {
    return this.execute(storeName as string, "readwrite", (store) => store.delete(key));
  }

  clear<S extends keyof DBSchema>(storeName: S): Observable<void> {
    return this.execute(storeName as string, "readwrite", (store) => store.clear());
  }

  deleteByIndex<S extends keyof DBSchema, I extends IndexName<DBSchema[S]>>(
    storeName: S,
    indexName: I,
    key: (IndexKey<DBSchema[S], I> & IDBValidKey) | IDBKeyRange,
  ): Observable<void> {
    return this.db$.pipe(
      switchMap(
        (db) =>
          new Observable<void>((observer) => {
            const tx = db.transaction(storeName as string, "readwrite");
            const store = tx.objectStore(storeName as string);
            const index = store.index(indexName);
            const request = index.openCursor(key);

            request.onsuccess = () => {
              const cursor = request.result;
              if (cursor) {
                cursor.delete();
                cursor.continue();
              }
            };

            tx.oncomplete = () => {
              observer.next();
              observer.complete();
              this.write$.next(storeName);
            };
            tx.onabort = () => observer.error(new Error("Transaction aborted"));
            tx.onerror = () => observer.error(tx.error);
          }),
      ),
    );
  }

  liveQuery<T>(
    storeName: keyof DBSchema | (keyof DBSchema)[],
    query: (db: this) => Observable<T>,
  ): Observable<T> {
    const stores = Array.isArray(storeName) ? storeName : [storeName];
    return merge(of(null), ...stores.map((s) => this.changes(s))).pipe(
      switchMap(() => query(this)),
    );
  }

  private changes<S extends keyof DBSchema>(storeName: S): Observable<void> {
    return this.write$.pipe(
      filter((store) => store === storeName),
      map(() => void 0),
    );
  }
}

export function idbRequest<T>(request: IDBRequest<T>): Promise<T> {
  return new Promise((resolve, reject) => {
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}
