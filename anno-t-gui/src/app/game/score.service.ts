import { Service, signal, type Signal, type WritableSignal } from "@angular/core";

@Service()
export class ScoreService {
  readonly #score: WritableSignal<number>;

  constructor() {
    this.#score = signal(0);
  }

  increaseScore(increaseBy: number): void {
    this.#score.update((old) => old + increaseBy);
  }

  score(): Signal<number> {
    return this.#score;
  }
}
