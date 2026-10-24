import type { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    title: "Anno't",
    loadComponent: () =>
      import("./pages/start-page/start-page.component").then((m) => m.StartPageComponent),
  },
  {
    path: "game",
    title: "Anno't",
    loadComponent: () =>
      import("./pages/game-page/game-page.component").then((m) => m.GamePageComponent),
  },
  {
    path: "game/summary",
    title: "Anno't - Summary",
    loadComponent: () =>
      import("./pages/game-summary-page/game-summary-page.component").then(
        (m) => m.GameSummaryPageComponent,
      ),
  },
];
