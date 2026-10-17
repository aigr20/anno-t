import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () =>
      import("./pages/start-page/start-page.component").then((m) => m.StartPageComponent),
  },
  {
    path: "game",
    loadComponent: () =>
      import("./pages/game-page/game-page.component").then((m) => m.GamePageComponent),
  },
];
