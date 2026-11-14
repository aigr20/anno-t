import {
  afterNextRender,
  Component,
  ElementRef,
  input,
  output,
  signal,
  viewChild,
  ViewContainerRef,
  type WritableSignal,
} from "@angular/core";
import type { PromptField, PromptFieldSpec, PromptOptions } from "./prompt.model";

@Component({
  imports: [],
  selector: "app-prompt",
  styleUrl: "./prompt.component.css",
  templateUrl: "./prompt.component.html",
})
export class PromptComponent {
  readonly options = input.required<PromptOptions>();
  readonly field = input.required<PromptFieldSpec<unknown>>();

  readonly closed = output<unknown>();

  protected readonly dialog = viewChild.required<ElementRef<HTMLDialogElement>>("dialog");
  protected readonly host = viewChild.required("host", { read: ViewContainerRef });

  readonly #instance: WritableSignal<PromptField<unknown> | null>;
  #done: boolean;

  constructor() {
    this.#instance = signal(null);
    this.#done = false;

    afterNextRender(() => {
      const spec = this.field();
      if (spec) {
        const ref = this.host().createComponent(spec.component);
        for (const [key, value] of Object.entries(spec.inputs ?? {})) {
          ref.setInput(key, value);
        }
        ref.changeDetectorRef.detectChanges();
        this.#instance.set(ref.instance);
      }
      this.dialog().nativeElement.showModal();
    });
  }

  protected submit(): void {
    if (!this.isValid()) {
      return;
    }

    const instance = this.#instance();
    this.close(instance ? instance.value() : true);
  }

  protected close(value: unknown): void {
    if (this.#done) {
      return;
    }

    this.#done = true;
    this.dialog().nativeElement.close();
    this.closed.emit(value);
  }

  protected isValid(): boolean {
    return true;
  }
}
