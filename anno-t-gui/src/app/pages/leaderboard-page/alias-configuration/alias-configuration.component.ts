import { Component, inject, signal, type Signal, type WritableSignal } from "@angular/core";
import { form, FormField, FormRoot, required, type FieldTree } from "@angular/forms/signals";
import { LeaderboardAliasService } from "@anno-t/leaderboard/leaderboard-alias.service";

@Component({
  imports: [FormRoot, FormField],
  selector: "app-alias-configuration",
  styleUrl: "./alias-configuration.component.css",
  templateUrl: "./alias-configuration.component.html",
})
export class AliasConfigurationComponent {
  protected readonly aliasFormModel: FieldTree<string>;

  readonly #message: WritableSignal<string>;
  readonly #backingAlias: WritableSignal<string>;
  readonly #aliasService: LeaderboardAliasService;

  constructor() {
    this.#aliasService = inject(LeaderboardAliasService);
    this.#backingAlias = signal(this.#aliasService.getPlayerAlias() ?? "");
    this.#message = signal("");

    this.aliasFormModel = form(this.#backingAlias, (schemaPath) => required(schemaPath), {
      submission: {
        action: async (field, detail) => {
          this.#aliasService.updateAlias(field().value());
          this.#message.set("Your chosen name has been updated.");
        },
      },
    });
  }

  protected clearDisabled(): boolean {
    return !this.#aliasService.getPlayerAlias();
  }

  protected clearAlias(): void {
    this.#aliasService.clearAlias();
    this.#backingAlias.set("");
    this.#message.set(
      "Your name has been removed. Results will no longer be saved to the leaderboard.",
    );
  }

  protected get message(): Signal<string> {
    return this.#message;
  }
}
