import {
  ApplicationRef,
  createComponent,
  DOCUMENT,
  EnvironmentInjector,
  inject,
  Service,
} from "@angular/core";
import { Observable } from "rxjs";
import { PromptComponent } from "./prompt.component";
import type { PromptFieldSpec, PromptOptions } from "./prompt.model";
import { TextFieldComponent } from "./fields/text-field/text-field.component";

@Service()
export class PromptService {
  readonly #appRef: ApplicationRef;
  readonly #injector: EnvironmentInjector;
  readonly #document: Document;

  constructor() {
    this.#appRef = inject(ApplicationRef);
    this.#injector = inject(EnvironmentInjector);
    this.#document = inject(DOCUMENT);
  }

  prompt<T>(options: PromptOptions, field?: PromptFieldSpec<T>): Observable<T | null> {
    return new Observable((subscriber) => {
      const ref = createComponent(PromptComponent, {
        environmentInjector: this.#injector,
      });
      ref.setInput("options", options);
      ref.setInput("field", field);

      this.#appRef.attachView(ref.hostView);
      this.#document.body.appendChild(ref.location.nativeElement);

      const sub = ref.instance.closed.subscribe((value) => {
        subscriber.next(value as T | null);
        subscriber.complete();
      });

      return () => {
        sub.unsubscribe();
        this.#appRef.detachView(ref.hostView);
        ref.destroy();
      };
    });
  }

  text(
    message: string,
    opts: Partial<PromptOptions> & { placeholder?: string; value?: string } = {},
  ): Observable<string | null> {
    const { placeholder, value, ...rest } = opts;
    return this.prompt(
      { ...rest, message },
      {
        component: TextFieldComponent,
        inputs: { placeholder: placeholder ?? "", value: value ?? "" },
      },
    );
  }
}
