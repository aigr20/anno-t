import { Component, computed, inject, type Signal } from "@angular/core";
import { form, FormField, FormRoot, required, type FieldTree } from "@angular/forms/signals";
import { toSuffix } from "@anno-t/common/bc-ad.pipe";
import { GameOrchestratorService } from "@anno-t/game/game-orchestrator.service";

@Component({
  imports: [FormRoot, FormField],
  selector: "app-make-guess",
  styleUrl: "./make-guess.component.css",
  templateUrl: "./make-guess.component.html",
})
export class MakeGuessComponent {
  readonly #gameOrchestrator: GameOrchestratorService;
  protected readonly guessFormModel: FieldTree<number>;
  protected readonly suffix: Signal<string>;

  constructor() {
    this.#gameOrchestrator = inject(GameOrchestratorService);
    this.guessFormModel = form(
      this.#gameOrchestrator.currentGuess(),
      (schemaPath) => {
        required(schemaPath);
      },
      {
        submission: {
          action: async () => {
            return new Promise((resolve, reject) => {
              this.#gameOrchestrator
                .makeGuess()
                .subscribe({ next: () => resolve(), error: (err) => reject(err) });
            });
          },
        },
      },
    );

    this.suffix = computed(() => toSuffix(this.#gameOrchestrator.currentGuess()()));
  }

  protected adjustBy(by: number): void {
    this.#gameOrchestrator.adjustGuess(by);
  }
}
