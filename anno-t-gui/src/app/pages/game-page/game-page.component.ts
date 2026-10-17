import { Component, inject, type Signal } from "@angular/core";
import type { Question } from "@anno-t/questions/question-types";
import { QuestionsService } from "@anno-t/questions/questions.service";

@Component({
  imports: [],
  selector: "app-game-page",
  styleUrl: "./game-page.component.css",
  templateUrl: "./game-page.component.html",
})
export class GamePageComponent {
  readonly #questions: QuestionsService;

  constructor() {
    this.#questions = inject(QuestionsService);
  }

  protected get currentQuestion(): Signal<Question | null> {
    return this.#questions.currentQuestion();
  }
}
