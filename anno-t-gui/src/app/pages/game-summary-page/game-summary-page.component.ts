import { Component, computed, inject, type Signal } from "@angular/core";
import { toSignal } from "@angular/core/rxjs-interop";
import { BaseLayoutComponent } from "@anno-t/common/base-layout/base-layout.component";
import { GameHistoryService } from "@anno-t/game/game-history.service";
import { map } from "rxjs";
import { AnswersSummaryComponent } from "./answers-summary/answers-summary.component";

@Component({
  imports: [AnswersSummaryComponent, BaseLayoutComponent],
  selector: "app-game-summary-page",
  styleUrl: "./game-summary-page.component.css",
  templateUrl: "./game-summary-page.component.html",
})
export class GameSummaryPageComponent {
  readonly #history: GameHistoryService;
  protected readonly score: Signal<number>;

  constructor() {
    this.#history = inject(GameHistoryService);
    const score$ = this.#history.todaysPlayedGame().pipe(map((game) => game.score ?? 0));
    const scoreSignal = toSignal(score$);
    this.score = computed(() => {
      return scoreSignal() ?? 0;
    });
  }
}
