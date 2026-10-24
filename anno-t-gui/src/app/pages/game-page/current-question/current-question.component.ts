import { Component, inject, type Signal } from "@angular/core";
import { CurrentGameService } from "@anno-t/game/current-game.service";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";
import type { GuessResult, Question } from "@anno-t/generated-openapi";
import { BcAdPipe } from "../../../common/bc-ad.pipe";

@Component({
  imports: [BcAdPipe],
  selector: "app-current-question",
  styleUrl: "./current-question.component.css",
  templateUrl: "./current-question.component.html",
})
export class CurrentQuestionComponent {
  readonly #currentGame: CurrentGameService;
  readonly #gameOrchestrator: GameOrchestratorService;

  constructor() {
    this.#currentGame = inject(CurrentGameService);
    this.#gameOrchestrator = inject(GameOrchestratorService);
  }

  protected loadNextQuestion(): void {
    this.#gameOrchestrator.nextQuestion();
  }

  protected get question(): Signal<Question | null> {
    return this.#currentGame.currentQuestion();
  }

  protected get result(): Signal<GuessResult | null> {
    return this.#currentGame.currentResult();
  }
}
