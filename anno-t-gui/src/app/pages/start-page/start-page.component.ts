import { Component, inject } from "@angular/core";
import { GameHistoryService } from "@anno-t/game/game-history.service";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";

@Component({
  imports: [],
  selector: "app-start-page",
  styleUrl: "./start-page.component.css",
  templateUrl: "./start-page.component.html",
})
export class StartPageComponent {
  readonly #orchestrator: GameOrchestratorService;
  readonly #historyService: GameHistoryService;

  constructor() {
    this.#orchestrator = inject(GameOrchestratorService);
    this.#historyService = inject(GameHistoryService);
  }

  protected canStart(): boolean {
    return !this.#historyService.hasPlayedToday();
  }

  protected start() {
    this.#orchestrator.begin();
  }
}
