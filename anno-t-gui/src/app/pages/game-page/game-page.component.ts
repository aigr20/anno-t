import { Component, inject, signal, type Signal, type WritableSignal } from "@angular/core";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";
import { ScoreService } from "@anno-t/game/score.service";
import type { Question } from "@anno-t/questions/question-types";
import { AdjustGuessButtonsComponent } from "./adjust-guess-buttons/adjust-guess-buttons.component";
import { BcAdPipe } from "./bc-ad.pipe";
import { CurrentGameService } from "@anno-t/game/current-game.service";

@Component({
  imports: [AdjustGuessButtonsComponent, BcAdPipe],
  selector: "app-game-page",
  styleUrl: "./game-page.component.css",
  templateUrl: "./game-page.component.html",
})
export class GamePageComponent {
  readonly #score: ScoreService;
  readonly #gameOrchestrator: GameOrchestratorService;
  readonly #currentGame: CurrentGameService;
  readonly #currentGuess: WritableSignal<number>;

  constructor() {
    this.#currentGame = inject(CurrentGameService);
    this.#score = inject(ScoreService);
    this.#gameOrchestrator = inject(GameOrchestratorService);
    this.#currentGuess = signal(1000);
  }

  protected adjustGuessBy(by: number): void {
    this.#currentGuess.update((old) => old + by);
  }

  protected makeGuess(): void {
    this.#gameOrchestrator
      .makeGuess(this.#currentGuess())
      .subscribe(() => this.#currentGuess.set(1000));
  }

  protected get currentQuestion(): Signal<Question | null> {
    return this.#currentGame.currentQuestion();
  }

  protected get currentGuess(): Signal<number> {
    return this.#currentGuess;
  }

  protected get currentScore(): Signal<number> {
    return this.#score.score();
  }
}
