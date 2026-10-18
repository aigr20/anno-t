import { inject, Service } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionsService } from "@anno-t/questions/questions.service";
import { map, type Observable } from "rxjs";
import { ScoreService } from "./score.service";

@Service()
export class GameOrchestratorService {
  readonly #router: Router;
  readonly #questions: QuestionsService;
  readonly #score: ScoreService;
  #currentIndex: number | null;

  constructor() {
    this.#router = inject(Router);
    this.#questions = inject(QuestionsService);
    this.#score = inject(ScoreService);
    this.#currentIndex = null;
  }

  begin(): void {
    this.#currentIndex = 0;
    this.#questions.tryLoadQuestion(this.#currentIndex);
    this.#router.navigate(["game"]);
  }

  makeGuess(guess: number): Observable<void> {
    const index = this.requireIndex();
    return this.#questions.submitGuess(index, guess).pipe(
      map((result) => {
        this.#score.increaseScore(result.score);
        const nextIndex = index + 1;
        this.#questions.tryLoadQuestion(nextIndex);
        this.#currentIndex = nextIndex;

        return void 0;
      }),
    );
  }

  private requireIndex(): number {
    const index = this.#currentIndex;
    if (index === null) {
      throw new Error("No question active");
    }
    return index;
  }
}
