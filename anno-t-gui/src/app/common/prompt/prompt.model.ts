import type { Signal, Type } from "@angular/core";

export interface PromptOptions {
  title?: string;
  message?: string;
  okLabel?: string;
  cancelLabel?: string;
}

export interface PromptField<T> {
  readonly value: Signal<T>;
  readonly valid?: Signal<boolean>;
}

export interface PromptFieldSpec<T> {
  component: Type<PromptField<T>>;
  inputs: Record<string, unknown>;
}
