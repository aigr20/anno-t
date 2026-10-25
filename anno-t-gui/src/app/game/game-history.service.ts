import { inject, linkedSignal, Service, type WritableSignal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import type { AnnoSchema } from "@anno-t/common/anno-schema";
import type { Game } from "@anno-t/generated-openapi";
import { IndexedDBService } from "@anno-t/idb/indexeddb.service";
import { map, of, switchMap, take, throwError, type Observable } from "rxjs";
import { CurrentGameService } from "./current-game.service";
import { ScoreService } from "./score.service";

export interface RecordedGame {
  readonly id: string;
  readonly answers: HistoricalAnswer[];
  readonly gameBegan: Date;
  readonly gameExpired: Date;
  readonly gameCompleted?: Date;
  readonly score: number;
}

export interface HistoricalAnswer {
  readonly question: string;
  readonly correctAnswer: number;
  readonly userAnswer: number;
  readonly scoreReceived: number;
}

@Service()
export class GameHistoryService {
  readonly #currentGame: CurrentGameService;
  readonly #idb: IndexedDBService<AnnoSchema>;
  readonly #score: ScoreService;
  readonly #localGame: WritableSignal<RecordedGame | null>;
  readonly #localGame$: Observable<RecordedGame | null>;

  constructor() {
    this.#currentGame = inject(CurrentGameService);
    this.#idb = inject<IndexedDBService<AnnoSchema>>(IndexedDBService);
    this.#score = inject(ScoreService);

    this.#localGame = linkedSignal<Game | null, RecordedGame | null>({
      source: this.#currentGame.activeGame(),
      computation: (newValue, old) => {
        const score = this.#score.score()();
        if (!newValue) {
          return null;
        }

        if (!old?.value) {
          return {
            id: newValue.id,
            gameBegan: new Date(newValue.begins),
            gameExpired: new Date(newValue.expires),
            answers: [],
            score: 0,
          } satisfies RecordedGame;
        }

        return {
          ...old.value,
          score,
        } satisfies RecordedGame;
      },
    });

    this.#localGame$ = toObservable(this.#localGame);
  }

  hasPlayedToday(): Observable<boolean> {
    return this.getTodaysResult().pipe(map((game) => !!game));
  }

  recordAnswer(answer: HistoricalAnswer): void {
    this.#localGame.update((old) => {
      if (old === null) {
        return null;
      }
      const answers = [...old.answers, answer];
      return { ...old, answers };
    });
  }

  recordGame(): Observable<void> {
    const toRecord = this.#localGame();
    if (!toRecord) {
      throw new Error("No game to record");
    }

    return this.#idb.add("game-history", toRecord).pipe(map(() => void 0));
  }

  todaysPlayedGame(): Observable<RecordedGame> {
    return this.#localGame$.pipe(
      take(1),
      switchMap((game) => {
        if (game === null) {
          return this.getTodaysResult().pipe(
            switchMap((stored) => {
              if (!stored) {
                return throwError(() => new Error("No game played"));
              }
              return of(stored);
            }),
          );
        }
        return of(game);
      }),
    );
  }

  private getTodaysResult(): Observable<RecordedGame | undefined> {
    const today = new Date();

    // This should always be either one or zero games, unless the user
    // somehow has managed to play games from the future.
    return this.#idb.getByIndex("game-history", "expired", IDBKeyRange.lowerBound(today));
  }
}
