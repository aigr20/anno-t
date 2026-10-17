import { inject, Service } from "@angular/core";
import { Router } from "@angular/router";
import { QuestionsService } from "@anno-t/questions/questions.service";

@Service()
export class GameOrchestratorService {
  readonly #router: Router;
  readonly #questions: QuestionsService;
  #currentIndex: number | null;

  constructor() {
    this.#router = inject(Router);
    this.#questions = inject(QuestionsService);
    this.#currentIndex = null;
  }

  begin(): void {
    this.#currentIndex = 0;
    this.#questions.tryLoadQuestion(this.#currentIndex);
    this.#router.navigate(["game"]);
  }
}
