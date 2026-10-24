import { Component, inject, type Signal } from "@angular/core";
import { BcAdPipe } from "@anno-t/common/bc-ad.pipe";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";
import { ScoreService } from "@anno-t/game/score.service";
import { AdjustGuessButtonsComponent } from "./adjust-guess-buttons/adjust-guess-buttons.component";
import { CurrentQuestionComponent } from "./current-question/current-question.component";

@Component({
  imports: [AdjustGuessButtonsComponent, BcAdPipe, CurrentQuestionComponent],
  selector: "app-game-page",
  styleUrl: "./game-page.component.css",
  templateUrl: "./game-page.component.html",
})
export class GamePageComponent {
  readonly #score: ScoreService;
  readonly #gameOrchestrator: GameOrchestratorService;

  constructor() {
    this.#score = inject(ScoreService);
    this.#gameOrchestrator = inject(GameOrchestratorService);
  }

  protected adjustGuessBy(by: number): void {
    this.#gameOrchestrator.adjustGuess(by);
  }

  protected makeGuess(): void {
    this.#gameOrchestrator.makeGuess().subscribe();
  }

  protected get currentGuess(): Signal<number> {
    return this.#gameOrchestrator.currentGuess();
  }

  protected get currentScore(): Signal<number> {
    return this.#score.score();
  }
}
