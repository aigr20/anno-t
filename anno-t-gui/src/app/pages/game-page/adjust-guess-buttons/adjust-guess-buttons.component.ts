import { Component, output } from "@angular/core";

@Component({
  imports: [],
  selector: "app-adjust-guess-buttons",
  styleUrl: "./adjust-guess-buttons.component.css",
  templateUrl: "./adjust-guess-buttons.component.html",
})
export class AdjustGuessButtonsComponent {
  readonly adjustEvent = output<number>({ alias: "adjust" });

  protected adjustBy(by: number): void {
    this.adjustEvent.emit(by);
  }
}
