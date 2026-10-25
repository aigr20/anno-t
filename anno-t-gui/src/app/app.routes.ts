import type { Routes } from "@angular/router";
import { hasActiveGameGuard } from "./game/has-active-game.guard";
import { hasNotPlayedTodayGuard } from "./game/has-not-played-today.guard";
import { hasPlayedTodayGuard } from "./game/has-played-today.guard";

export const routes: Routes = [
  {
    path: "",
    title: "Anno't",
    canActivate: [hasNotPlayedTodayGuard],
    loadComponent: () =>
      import("./pages/start-page/start-page.component").then((m) => m.StartPageComponent),
  },
  {
    path: "game",
    title: "Anno't",
    canActivate: [hasActiveGameGuard, hasNotPlayedTodayGuard],
    loadComponent: () =>
      import("./pages/game-page/game-page.component").then((m) => m.GamePageComponent),
  },
  {
    path: "game/summary",
    title: "Anno't - Summary",
    canActivate: [hasPlayedTodayGuard],
    loadComponent: () =>
      import("./pages/game-summary-page/game-summary-page.component").then(
        (m) => m.GameSummaryPageComponent,
      ),
  },
];
