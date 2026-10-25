import { inject, Service } from "@angular/core";
import { GameHistoryService } from "@anno-t/game/game-history.service";

@Service()
export class CopySummaryService {
  readonly #gameHistory: GameHistoryService;

  constructor() {
    this.#gameHistory = inject(GameHistoryService);
  }

  copy(): void {
    this.#gameHistory.todaysPlayedGame().subscribe((game) => {
      const date = `${pad0(game.gameBegan.getUTCFullYear())}-${pad0(game.gameBegan.getUTCMonth() + 1)}-${pad0(game.gameBegan.getUTCDate())}`;
      const content = game.answers
        .map((answer) => answer.scoreReceived)
        .map(String)
        .join(" ");
      globalThis.navigator.clipboard.writeText(`Anno't ${date}
${game.score}/500
${content}`);
    });
  }
}

function pad0(n: number): string {
  if (n < 10) {
    return `0${n}`;
  }
  return `${n}`;
}
