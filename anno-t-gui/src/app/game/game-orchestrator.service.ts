import { inject, Service } from "@angular/core";
import { Router } from "@angular/router";
import { map, take, type Observable } from "rxjs";
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
    this.#currentGame
      .endOfGame$()
      .pipe(take(1))
      .subscribe(() => this.endGame());
  }

  endGame(): void {
    this.#router.navigate(["game", "summary"]);
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
