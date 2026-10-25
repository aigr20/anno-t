import { type CanActivateFn, RedirectCommand, Router } from "@angular/router";
import { GameHistoryService } from "./game-history.service";
import { inject } from "@angular/core";
import { map } from "rxjs";

export const hasNotPlayedTodayGuard: CanActivateFn = (route, state) => {
  const history = inject(GameHistoryService);
  const router = inject(Router);
  return history.hasPlayedToday().pipe(
    map((has) => {
      if (has) {
        const url = router.parseUrl("/game/summary");
        return new RedirectCommand(url);
      }
      return true;
    }),
  );
};
