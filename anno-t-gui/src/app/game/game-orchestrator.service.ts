import { inject, Service, signal, type WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { map, switchMap, take, type Observable } from "rxjs";
import { CurrentGameService } from "./current-game.service";
import { GameHistoryService } from "./game-history.service";
import { ScoreService } from "./score.service";
import { LeaderboardService } from "@anno-t/leaderboard/leaderboard.service";

@Service()
export class GameOrchestratorService {
  readonly #router: Router;
  readonly #score: ScoreService;
  readonly #currentGame: CurrentGameService;
  readonly #gameHistory: GameHistoryService;
  readonly #leaderboard: LeaderboardService;
  readonly #guess: WritableSignal<number>;

  constructor() {
    this.#router = inject(Router);
    this.#score = inject(ScoreService);
    this.#currentGame = inject(CurrentGameService);
    this.#gameHistory = inject(GameHistoryService);
    this.#leaderboard = inject(LeaderboardService);
    this.#guess = signal(1000);
  }

  begin(): void {
    this.#currentGame.startGame().subscribe(() => this.#router.navigate(["game"]));
    this.#currentGame
      .endOfGame$()
      .pipe(take(1))
      .subscribe(() => this.endGame());
    this.#guess.set(1000);
  }

  endGame(): void {
    this.#gameHistory
      .recordGame()
      .pipe(switchMap(() => this.#leaderboard.saveUserScore()))
      .subscribe(() => {
        this.#router.navigate(["game", "summary"]);
      });
  }

  adjustGuess(by: number): void {
    this.#guess.update((old) => old + by);
  }

  makeGuess(): Observable<void> {
    const guess = this.#guess();
    return this.#currentGame.makeGuess(guess).pipe(
      map((result) => {
        const guessedOnQuestion = this.#currentGame.currentQuestion()();
        if (!guessedOnQuestion) {
          throw new Error("Answered non-existing question");
        }

        this.#score.increaseScore(result.score);
        this.#gameHistory.recordAnswer({
          question: guessedOnQuestion.question,
          scoreReceived: result.score,
          correctAnswer: result.correctAnswer,
          userAnswer: guess,
        });
      }),
    );
  }

  nextQuestion(): void {
    this.#currentGame.advanceToNextQuestion();
    this.#guess.set(1000);
  }

  currentGuess(): WritableSignal<number> {
    return this.#guess;
  }
}
