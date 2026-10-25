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
      const content = game.answers
        .map((answer) => answer.scoreReceived)
        .map(String)
        .join(" ");
      globalThis.navigator.clipboard.writeText("Anno't\n" + content);
    });
  }
}
