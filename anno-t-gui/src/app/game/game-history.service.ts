import { inject, Service } from "@angular/core";
import { CurrentGameService } from "./current-game.service";
import { RecordedAnswersService } from "@anno-t/questions/recorded-answers.service";
import { ScoreService } from "./score.service";
import { IndexedDBService } from "@anno-t/idb/indexeddb.service";
import type { AnnoSchema } from "@anno-t/common/anno-schema";

export interface RecordedGame {
  readonly id: string;
  readonly answers: HistoricalAnswer[];
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
  readonly #questionHistory: RecordedAnswersService;
  readonly #score: ScoreService;
  readonly #idb: IndexedDBService<AnnoSchema>;

  constructor() {
    this.#currentGame = inject(CurrentGameService);
    this.#questionHistory = inject(RecordedAnswersService);
    this.#score = inject(ScoreService);
    this.#idb = inject<IndexedDBService<AnnoSchema>>(IndexedDBService);
  }

  hasPlayedToday(): boolean {
    return false;
  }

  recordGame(): void {
    const game = this.#currentGame.activeGame();
    if (!game) {
      throw new Error("No game active");
    }

    const answers = this.#questionHistory
      .answers()()
      .map((question) => ({
        question: question.question,
        correctAnswer: question.correctAnswer,
        userAnswer: question.answer,
        scoreReceived: question.receivedScore,
      }));
    const score = this.#score.score();

    const toRecord: RecordedGame = {
      id: game.id,
      answers,
      score: score(),
    };

    this.#idb.add("game-history", toRecord).subscribe();
  }
}
