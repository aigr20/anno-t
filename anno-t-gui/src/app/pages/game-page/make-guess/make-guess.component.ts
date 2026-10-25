import { Component, inject, type Signal } from "@angular/core";
import { BcAdPipe } from "@anno-t/common/bc-ad.pipe";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";

@Component({
  imports: [BcAdPipe],
  selector: "app-make-guess",
  styleUrl: "./make-guess.component.css",
  templateUrl: "./make-guess.component.html",
})
export class MakeGuessComponent {
  readonly #gameOrchestrator: GameOrchestratorService;

  constructor() {
    this.#gameOrchestrator = inject(GameOrchestratorService);
  }

  protected adjustBy(by: number): void {
    this.#gameOrchestrator.adjustGuess(by);
  }

  protected makeGuess(): void {
    this.#gameOrchestrator.makeGuess().subscribe();
  }

  get currentGuess(): Signal<number> {
    return this.#gameOrchestrator.currentGuess();
  }
}
