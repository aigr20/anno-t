import { inject, Service, signal, type Signal, type WritableSignal } from "@angular/core";
import { QuestionService, type GuessResult } from "@anno-t/generated-openapi";
import type { Question } from "./question-types";
import type { Observable } from "rxjs";

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

  submitGuess(index: number, guess: number): Observable<GuessResult> {
    return this.#questionsApi.makeGuess(index, { year: guess });
  }

  currentQuestion(): Signal<Question | null> {
    return this.#currentQuestion;
  }
}
