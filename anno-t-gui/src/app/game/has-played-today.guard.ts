import { RedirectCommand, Router, type CanActivateFn } from "@angular/router";
import { GameHistoryService } from "./game-history.service";
import { inject } from "@angular/core";
import { catchError, map, of, tap } from "rxjs";

export const hasPlayedTodayGuard: CanActivateFn = (route, state) => {
  const history = inject(GameHistoryService);
  const router = inject(Router);
  return history.hasPlayedToday().pipe(
    catchError(() => {
      return of(false);
    }),
    map((v) => {
      if (v) {
        return v;
      }

      const homeUrl = router.parseUrl("/");
      return new RedirectCommand(homeUrl);
    }),
  );
};
