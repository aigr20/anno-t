import { Component, inject, signal, type Signal, type WritableSignal } from "@angular/core";
import type { Question } from "@anno-t/questions/question-types";
import { QuestionsService } from "@anno-t/questions/questions.service";
import { AdjustGuessButtonsComponent } from "./adjust-guess-buttons/adjust-guess-buttons.component";
import { BcAdPipe } from "./bc-ad.pipe";

@Component({
  imports: [AdjustGuessButtonsComponent, BcAdPipe],
  selector: "app-game-page",
  styleUrl: "./game-page.component.css",
  templateUrl: "./game-page.component.html",
})
export class GamePageComponent {
  readonly #questions: QuestionsService;
  readonly #currentGuess: WritableSignal<number>;

  constructor() {
    this.#questions = inject(QuestionsService);
    this.#currentGuess = signal(1000);
  }

  protected adjustGuessBy(by: number): void {
    this.#currentGuess.update((old) => old + by);
  }

  protected get currentQuestion(): Signal<Question | null> {
    return this.#questions.currentQuestion();
  }

  protected get currentGuess(): Signal<number> {
    return this.#currentGuess;
  }
}
