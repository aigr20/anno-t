import { inject, Service } from "@angular/core";
import { GameHistoryService } from "@anno-t/game/game-history.service";
import { LeaderboardService as LeaderboardApi } from "@anno-t/generated-openapi";
import { combineLatestWith, Observable, of, switchMap } from "rxjs";
import { LeaderboardAliasService } from "./leaderboard-alias.service";

@Service()
export class LeaderboardService {
  readonly #leaderboardApi: LeaderboardApi;
  readonly #leaderboardAlias: LeaderboardAliasService;
  readonly #recordedGame: GameHistoryService;

  constructor() {
    this.#leaderboardApi = inject(LeaderboardApi);
    this.#leaderboardAlias = inject(LeaderboardAliasService);
    this.#recordedGame = inject(GameHistoryService);
  }

  saveUserScore(): Observable<void> {
    return this.#leaderboardAlias.promptForAlias().pipe(
      combineLatestWith(this.#recordedGame.todaysPlayedGame()),
      switchMap(([alias, game]) => {
        if (!alias) {
          return of(null);
        }
        const scoreByQuestion = game.answers.map((answer) => answer.scoreReceived);

        return this.#leaderboardApi.submitGameResult(game.id, {
          totalScore: game.score,
          scoreByQuestion,
          playerAlias: alias,
        });
      }),
    );
  }
}
