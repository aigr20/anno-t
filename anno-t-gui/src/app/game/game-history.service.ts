import { inject, linkedSignal, Service, type WritableSignal } from "@angular/core";
import { toObservable } from "@angular/core/rxjs-interop";
import type { AnnoSchema } from "@anno-t/common/anno-schema";
import { IndexedDBService } from "@anno-t/idb/indexeddb.service";
import { map, of, switchMap, take, throwError, type Observable } from "rxjs";
import { CurrentGameService } from "./current-game.service";

export interface RecordedGame {
  readonly id: string;
  readonly answers: HistoricalAnswer[];
  readonly gameBegan: Date;
  readonly gameExpired: Date;
  readonly gameCompleted?: Date;
  readonly score?: number;
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
  readonly #localGame: WritableSignal<RecordedGame | null>;
  readonly #localGame$: Observable<RecordedGame | null>;

  constructor() {
    this.#currentGame = inject(CurrentGameService);
    this.#idb = inject<IndexedDBService<AnnoSchema>>(IndexedDBService);
    this.#localGame = linkedSignal(() => {
      const game = this.#currentGame.activeGame();
      if (!game) {
        return null;
      }

      return {
        id: game.id,
        gameBegan: new Date(game.begins),
        gameExpired: new Date(game.expires),
        answers: [],
      };
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

  recordGame(): void {
    const toRecord = this.#localGame();
    if (!toRecord) {
      throw new Error("No game to record");
    }

    this.#idb.add("game-history", toRecord).subscribe();
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
