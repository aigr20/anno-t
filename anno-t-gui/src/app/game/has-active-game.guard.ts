import { inject } from "@angular/core";
import { RedirectCommand, Router, type CanActivateFn } from "@angular/router";
import { CurrentGameService } from "./current-game.service";

export const hasActiveGameGuard: CanActivateFn = (route, state) => {
  const currentGame = inject(CurrentGameService);
  if (currentGame.hasStartedGame()) {
    return true;
  }

  const router = inject(Router);
  const startPath = router.parseUrl("/");
  return new RedirectCommand(startPath);
};
