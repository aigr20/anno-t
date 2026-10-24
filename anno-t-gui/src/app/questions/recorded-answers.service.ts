import { Service, signal, type Signal, type WritableSignal } from "@angular/core";

export interface RecordedAnswer {
  readonly question: string;
  readonly answer: number;
  readonly correctAnswer: number;
  readonly receivedScore: number;
}

@Service()
export class RecordedAnswersService {
  readonly #record: WritableSignal<RecordedAnswer[]>;

  constructor() {
    this.#record = signal([]);
  }

  record(answer: RecordedAnswer): void {
    this.#record.update((old) => [...old, answer]);
  }

  answers(): Signal<RecordedAnswer[]> {
    return this.#record;
  }
}
