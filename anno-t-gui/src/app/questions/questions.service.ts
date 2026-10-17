import { inject, Service, signal, type Signal, type WritableSignal } from "@angular/core";
import { QuestionService } from "@anno-t/generated-openapi";
import type { Question } from "./question-types";

@Service()
export class QuestionsService {
  readonly #currentQuestion: WritableSignal<Question | null>;
  readonly #questionsApi: QuestionService;

  constructor() {
    this.#currentQuestion = signal(null);
    this.#questionsApi = inject(QuestionService);
  }

  tryLoadQuestion(index: number): void {
    this.#questionsApi.getQuestion(index).subscribe((question) => {
      this.#currentQuestion.set({ question: question.question });
    });
  }

  currentQuestion(): Signal<Question | null> {
    return this.#currentQuestion;
  }
}
