import { inject, Service } from "@angular/core";
import { GameHistoryService } from "@anno-t/game/game-history.service";
import { InfoService } from "@anno-t/generated-openapi";
import { combineLatestWith, map, shareReplay, type Observable } from "rxjs";

@Service()
export class CopySummaryService {
  readonly #gameHistory: GameHistoryService;
  readonly #infoService: InfoService;
  readonly #gameUrl$: Observable<string>;

  constructor() {
    this.#gameHistory = inject(GameHistoryService);
    this.#infoService = inject(InfoService);
    this.#gameUrl$ = this.#infoService.getInfo().pipe(
      map((info) => info.gameUrl),
      shareReplay(1),
    );
  }

  copy(): void {
    this.#gameHistory
      .todaysPlayedGame()
      .pipe(combineLatestWith(this.#gameUrl$))
      .subscribe(([game, gameUrl]) => {
        const date = `${pad0(game.gameBegan.getFullYear())}-${pad0(game.gameBegan.getMonth() + 1)}-${pad0(game.gameBegan.getDate())}`;
        const content = game.answers
          .map((answer) => answer.scoreReceived)
          .map(this.transformScoreToText.bind(this))
          .join(" ");
        globalThis.navigator.clipboard.writeText(`Anno't ${date}
${game.score}/500
${content}

Try it yourself at ${gameUrl}`);
      });
  }

  private transformScoreToText(score: number): string {
    return `${this.scoreToEmoji(score)} ${score}`;
  }

  private scoreToEmoji(score: number): string {
    if (score < 35) {
      return "🪦";
    }
    if (score < 55) {
      return "🤔";
    }
    if (score < 75) {
      return "👍";
    }
    if (score < 90) {
      return "🌟";
    }
    return "🎯";
  }
}

function pad0(n: number): string {
  if (n < 10) {
    return `0${n}`;
  }
  return `${n}`;
}
