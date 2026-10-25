import { Component, computed, inject, type Signal } from "@angular/core";
import { CurrentGameService } from "@anno-t/game/current-game.service";
import { ScoreService } from "@anno-t/game/score.service";
import { CurrentQuestionComponent } from "./current-question/current-question.component";
import { MakeGuessComponent } from "./make-guess/make-guess.component";

@Component({
  imports: [MakeGuessComponent, CurrentQuestionComponent],
  selector: "app-game-page",
  styleUrl: "./game-page.component.css",
  templateUrl: "./game-page.component.html",
})
export class GamePageComponent {
  protected readonly isDisplayingResult: Signal<boolean>;

  readonly #score: ScoreService;
  readonly #currentGame: CurrentGameService;

  constructor() {
    this.#score = inject(ScoreService);
    this.#currentGame = inject(CurrentGameService);

    this.isDisplayingResult = computed(() => this.#currentGame.currentResult()() !== null);
  }

  protected get currentScore(): Signal<number> {
    return this.#score.score();
  }
}
