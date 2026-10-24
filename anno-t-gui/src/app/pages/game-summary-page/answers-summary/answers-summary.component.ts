import { Component, inject, type Signal } from "@angular/core";

import {
  RecordedAnswersService,
  type RecordedAnswer,
} from "@anno-t/questions/recorded-answers.service";
import { CopySummaryService } from "./copy-summary.service";
import { BcAdPipe } from "@anno-t/common/bc-ad.pipe";
@Component({
  imports: [BcAdPipe],
  selector: "app-answers-summary",
  styleUrl: "./answers-summary.component.css",
  templateUrl: "./answers-summary.component.html",
})
export class AnswersSummaryComponent {
  readonly #answersRecord: RecordedAnswersService;
  readonly #shareService: CopySummaryService;

  constructor() {
    this.#answersRecord = inject(RecordedAnswersService);
    this.#shareService = inject(CopySummaryService);
  }

  protected get answers(): Signal<RecordedAnswer[]> {
    return this.#answersRecord.answers();
  }

  protected shouldPresentDifference(answer: RecordedAnswer): boolean {
    return this.#diff(answer) !== 0;
  }

  protected presentDifference(answer: RecordedAnswer): string {
    const diff = answer.answer - answer.correctAnswer;
    return `${diff}`;
  }

  protected copyResults(): void {
    this.#shareService.copy();
  }

  #diff(answer: RecordedAnswer): number {
    return Math.abs(answer.answer - answer.correctAnswer);
  }
}
