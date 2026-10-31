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
        .map(this.transformScoreToText.bind(this))
        .join(" ");
      globalThis.navigator.clipboard.writeText(`Anno't ${date}
${game.score}/500
${content}`);
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
