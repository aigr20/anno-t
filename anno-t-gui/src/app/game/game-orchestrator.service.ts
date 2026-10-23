import { inject, Service } from "@angular/core";
import { Router } from "@angular/router";
import { map, type Observable } from "rxjs";
import { CurrentGameService } from "./current-game.service";
import { ScoreService } from "./score.service";

@Service()
export class GameOrchestratorService {
  readonly #router: Router;
  readonly #score: ScoreService;
  readonly #currentGame: CurrentGameService;

  constructor() {
    this.#router = inject(Router);
    this.#score = inject(ScoreService);
    this.#currentGame = inject(CurrentGameService);
  }

  begin(): void {
    this.#currentGame.startGame().subscribe(() => this.#router.navigate(["game"]));
  }

  makeGuess(guess: number): Observable<void> {
    return this.#currentGame.makeGuess(guess).pipe(
      map((result) => {
        this.#score.increaseScore(result.score);
        this.#currentGame.advanceToNextQuestion();
      }),
    );
  }
}
