import { inject, Service } from "@angular/core";
import { PromptService } from "@anno-t/common/prompt/prompt.service";
import { of, tap, type Observable } from "rxjs";

const HAS_PROMPTED_KEY = "has_prompted_leaderboard_name";
const LEADERBOARD_NAME_KEY = "leaderboard_name";
const YES = "yes";

@Service()
export class LeaderboardAliasService {
  readonly #promptService: PromptService;

  constructor() {
    this.#promptService = inject(PromptService);
  }

  hasPrompted(): boolean {
    return globalThis.localStorage.getItem(HAS_PROMPTED_KEY) === YES;
  }

  getPlayerAlias(): string | null {
    return globalThis.localStorage.getItem(LEADERBOARD_NAME_KEY);
  }

  updateAlias(alias: string): void {
    globalThis.localStorage.setItem(LEADERBOARD_NAME_KEY, alias);
    globalThis.localStorage.setItem(HAS_PROMPTED_KEY, YES);
  }

  clearAlias(): void {
    globalThis.localStorage.removeItem(LEADERBOARD_NAME_KEY);
    globalThis.localStorage.removeItem(HAS_PROMPTED_KEY);
  }

  promptForAlias(): Observable<string | null> {
    if (this.hasPrompted()) {
      return of(this.getPlayerAlias());
    }

    return this.#promptService
      .text(
        "If you'd like to save the result to the leaderboard, please input a name to be displayed in the leaderboard.",
      )
      .pipe(
        tap((alias) => {
          if (alias) {
            this.updateAlias(alias);
          } else {
            this.clearAlias();
          }
        }),
      );
  }
}
