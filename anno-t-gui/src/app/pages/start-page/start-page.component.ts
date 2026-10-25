import { Component, inject } from "@angular/core";
import { BaseLayoutComponent } from "@anno-t/common/base-layout/base-layout.component";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";

@Component({
  imports: [BaseLayoutComponent],
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
