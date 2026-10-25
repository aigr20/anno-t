import { inject, Service, signal, type Signal, type WritableSignal } from "@angular/core";
import { Router } from "@angular/router";
import { RecordedAnswersService } from "@anno-t/questions/recorded-answers.service";
import { map, take, type Observable } from "rxjs";
import { CurrentGameService } from "./current-game.service";
import { ScoreService } from "./score.service";
import { GameHistoryService } from "./game-history.service";

@Service()
export class GameOrchestratorService {
  readonly #router: Router;
  readonly #score: ScoreService;
  readonly #currentGame: CurrentGameService;
  readonly #answerHistory: RecordedAnswersService;
  readonly #gameHistory: GameHistoryService;
  readonly #guess: WritableSignal<number>;

  constructor() {
    this.#router = inject(Router);
    this.#score = inject(ScoreService);
    this.#currentGame = inject(CurrentGameService);
    this.#answerHistory = inject(RecordedAnswersService);
    this.#gameHistory = inject(GameHistoryService);
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
    this.#gameHistory.recordGame();
    this.#router.navigate(["game", "summary"]);
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

        this.#answerHistory.record({
          answer: guess,
          receivedScore: result.score,
          correctAnswer: result.correctAnswer,
          question: guessedOnQuestion.question,
        });
      }),
    );
  }

  nextQuestion(): void {
    this.#currentGame.advanceToNextQuestion();
    this.#guess.set(1000);
  }

  currentGuess(): Signal<number> {
    return this.#guess;
  }
}
