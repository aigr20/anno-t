import {
  Component,
  computed,
  inject,
  signal,
  type Signal,
  type WritableSignal,
} from "@angular/core";
import { BcAdPipe } from "@anno-t/common/bc-ad.pipe";
import {
  GameHistoryService,
  type HistoricalAnswer,
  type RecordedGame,
} from "@anno-t/game/game-history.service";
import { CopySummaryService } from "./copy-summary.service";
@Component({
  imports: [BcAdPipe],
  selector: "app-answers-summary",
  styleUrl: "./answers-summary.component.css",
  templateUrl: "./answers-summary.component.html",
})
export class AnswersSummaryComponent {
  readonly #shareService: CopySummaryService;
  readonly #gameHistory: GameHistoryService;
  readonly #historicalGame: WritableSignal<RecordedGame | null>;

  constructor() {
    this.#gameHistory = inject(GameHistoryService);
    this.#shareService = inject(CopySummaryService);
    this.#historicalGame = signal(null);
    this.#gameHistory.todaysPlayedGame().subscribe((game) => this.#historicalGame.set(game));
  }

  protected get answers(): Signal<HistoricalAnswer[]> {
    return computed(() => this.#historicalGame()?.answers ?? []);
  }

  protected shouldPresentDifference(answer: HistoricalAnswer): boolean {
    return this.#diff(answer) !== 0;
  }

  protected presentDifference(answer: HistoricalAnswer): string {
    const diff = answer.userAnswer - answer.correctAnswer;
    return `${diff}`;
  }

  protected copyResults(): void {
    this.#shareService.copy();
  }

  #diff(answer: HistoricalAnswer): number {
    return Math.abs(answer.userAnswer - answer.correctAnswer);
  }
}
