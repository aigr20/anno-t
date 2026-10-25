import { Component, computed, inject, type Signal } from "@angular/core";
import { BaseLayoutComponent } from "@anno-t/common/base-layout/base-layout.component";
import { CurrentGameService } from "@anno-t/game/current-game.service";
import { CurrentQuestionComponent } from "./current-question/current-question.component";
import { MakeGuessComponent } from "./make-guess/make-guess.component";

@Component({
  imports: [MakeGuessComponent, CurrentQuestionComponent, BaseLayoutComponent],
  selector: "app-game-page",
  styleUrl: "./game-page.component.css",
  templateUrl: "./game-page.component.html",
})
export class GamePageComponent {
  protected readonly isDisplayingResult: Signal<boolean>;

  readonly #currentGame: CurrentGameService;

  constructor() {
    this.#currentGame = inject(CurrentGameService);

    this.isDisplayingResult = computed(() => this.#currentGame.currentResult()() !== null);
  }
}
