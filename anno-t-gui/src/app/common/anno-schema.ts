import type { RecordedGame } from "@anno-t/game/game-history.service";
import type { DefineSchema, Migration } from "@anno-t/idb/indexeddb.service";

export const migrations: Migration[] = [{ version: 1, migrate: schemaV1 }];

export type AnnoSchema = DefineSchema<{
  "game-history": {
    value: RecordedGame;
    key: string;
    indices: [
      {
        name: "expired";
        value: Date;
      },
    ];
  };
}>;

function schemaV1(db: IDBDatabase): void {
  const historyStore = db.createObjectStore("game-history", {
    keyPath: "id",
    autoIncrement: false,
  });
  historyStore.createIndex("expired", "gameExpired");
}
