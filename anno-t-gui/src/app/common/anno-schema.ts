import type { RecordedGame } from "@anno-t/game/game-history.service";
import type { DefineSchema, Migration } from "@anno-t/idb/indexeddb.service";

export const migrations: Migration[] = [{ version: 1, migrate: schemaV1 }];

export type AnnoSchema = DefineSchema<{
  "game-history": {
    value: RecordedGame;
    key: string;
  };
}>;

function schemaV1(db: IDBDatabase): void {
  db.createObjectStore("game-history", { keyPath: "id", autoIncrement: false });
}
