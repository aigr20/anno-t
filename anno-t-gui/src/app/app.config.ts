import { provideBrowserGlobalErrorListeners, type ApplicationConfig } from "@angular/core";
import { provideRouter } from "@angular/router";
import { provideDefaultClient } from "@anno-t/generated-openapi";
import { routes } from "./app.routes";
import { migrations } from "./common/anno-schema";
import { provideIndexedDBConfig } from "./idb/indexeddb.service";

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes),
    provideDefaultClient({ basePath: "/api" }),
    provideIndexedDBConfig({
      dbName: "anno-db",
      migrations,
      version: 1,
    }),
  ],
};
