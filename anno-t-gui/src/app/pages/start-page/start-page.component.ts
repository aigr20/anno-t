import { Component, inject } from "@angular/core";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";

@Component({
  imports: [],
  selector: "app-start-page",
  styleUrl: "./start-page.component.css",
  templateUrl: "./start-page.component.html",
})
export class StartPageComponent {
  readonly #orchestrator: GameOrchestratorService;

  constructor() {
    this.#orchestrator = inject(GameOrchestratorService);
  }

  protected start() {
    this.#orchestrator.begin();
  }
}
