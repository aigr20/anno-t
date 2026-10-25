import { type CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { GameHistoryService } from "./game-history.service";
import { inject } from "@angular/core";
import { catchError, map, of } from "rxjs";

export const hasNotPlayedTodayGuard: CanActivateFn = (route, state) => {
  const history = inject(GameHistoryService);
  const router = inject(Router);
  return history.hasPlayedToday().pipe(
    catchError(() => {
      return of(false);
    }),
    map((has) => {
      if (has) {
        const url = router.parseUrl("/game/summary");
        return new RedirectCommand(url);
      }
      return true;
    }),
  );
};
