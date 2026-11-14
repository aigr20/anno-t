import { Component, input, model } from "@angular/core";
import type { PromptField } from "../../prompt.model";

@Component({
  imports: [],
  selector: "app-text-field",
  styleUrl: "./text-field.component.css",
  templateUrl: "./text-field.component.html",
})
export class TextFieldComponent implements PromptField<string> {
  readonly value = model("");
  readonly placeholder = input<string>();

  constructor() {}
}
