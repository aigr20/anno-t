import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/anno-t-page/anno-t-page.component").then((m) => m.AnnoTPageComponent),
  },
];
