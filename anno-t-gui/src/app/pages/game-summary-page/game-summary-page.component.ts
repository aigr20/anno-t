import { Component, inject, type Signal } from "@angular/core";
import { ScoreService } from "@anno-t/game/score.service";
import { AnswersSummaryComponent } from "./answers-summary/answers-summary.component";
import { BaseLayoutComponent } from "@anno-t/common/base-layout/base-layout.component";

@Component({
  imports: [AnswersSummaryComponent, BaseLayoutComponent],
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
