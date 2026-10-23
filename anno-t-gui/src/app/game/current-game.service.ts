import { computed, inject, Service, signal, type Signal, type WritableSignal } from "@angular/core";
import { GameService, type Game, type GuessResult, type Question } from "@anno-t/generated-openapi";
import { map, tap, type Observable } from "rxjs";

@Service()
export class CurrentGameService {
  readonly #gameApi: GameService;
  readonly #game: WritableSignal<Game | null>;
  readonly #questionIndex: WritableSignal<number>;
  readonly #questionCount: Signal<number>;
  readonly #currentQuestion: Signal<Question | null>;

  constructor() {
    this.#gameApi = inject(GameService);
    this.#game = signal(null);
    this.#questionIndex = signal(0);
    this.#questionCount = computed(() => this.#game()?.questions?.length ?? 0);
    this.#currentQuestion = computed(() => {
      const game = this.#game();
      if (game === null) {
        return null;
      }
      return game.questions[this.#questionIndex()];
    });
  }

  startGame(): Observable<Game> {
    if (this.#game() !== null) {
      throw new Error();
    }

    return this.#gameApi.getCurrentGame().pipe(
      map((game) => {
        this.#game.set(game);
        this.#questionIndex.set(0);
        return game;
      }),
    );
  }

  makeGuess(guess: number): Observable<GuessResult> {
    const game = this.requireCurrentGame();

    return this.#gameApi.makeGuess(game.id, this.#questionIndex(), { year: guess });
  }

  advanceToNextQuestion(): void {
    if (this.#questionIndex() >= this.#questionCount() - 1) {
      console.error("Already at end of game");
      return;
    }
    this.#questionIndex.update((old) => old + 1);
  }

  currentQuestion(): Signal<Question | null> {
    return this.#currentQuestion;
  }

  totalQuestionsInGame(): Signal<number> {
    return this.#questionCount;
  }

  private requireCurrentGame(): Game {
    const game = this.#game();
    if (game === null) {
      throw new Error("No game running");
    }

    return game;
  }
}
