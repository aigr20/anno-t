import { Component, inject, type Signal } from "@angular/core";
import { ScoreService } from "@anno-t/game/score.service";

@Component({
  imports: [],
  selector: "app-game-summary-page",
  styleUrl: "./game-summary-page.component.css",
  templateUrl: "./game-summary-page.component.html",
})
export class GameSummaryPageComponent {
  readonly #score: ScoreService;

  constructor() {
    this.#score = inject(ScoreService);
  }

  get score(): Signal<number> {
    return this.#score.score();
  }
}
