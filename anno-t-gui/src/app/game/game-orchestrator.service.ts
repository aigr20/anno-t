import { inject, Service } from "@angular/core";
import { Router } from "@angular/router";
import { RecordedAnswersService } from "@anno-t/questions/recorded-answers.service";
import { map, take, type Observable } from "rxjs";
import { CurrentGameService } from "./current-game.service";
import { ScoreService } from "./score.service";

@Service()
export class GameOrchestratorService {
  readonly #router: Router;
  readonly #score: ScoreService;
  readonly #currentGame: CurrentGameService;
  readonly #answerHistory: RecordedAnswersService;

  constructor() {
    this.#router = inject(Router);
    this.#score = inject(ScoreService);
    this.#currentGame = inject(CurrentGameService);
    this.#answerHistory = inject(RecordedAnswersService);
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
        const guessedOnQuestion = this.#currentGame.currentQuestion()();
        if (!guessedOnQuestion) {
          throw new Error("Answered non-existing question");
        }

        this.#score.increaseScore(result.score);
        this.#currentGame.advanceToNextQuestion();

        this.#answerHistory.record({
          answer: guess,
          receivedScore: result.score,
          correctAnswer: result.correctAnswer,
          question: guessedOnQuestion.question,
        });
      }),
    );
  }
}
