import { inject, Service } from "@angular/core";
import { RecordedAnswersService } from "@anno-t/questions/recorded-answers.service";

@Service()
export class CopySummaryService {
  readonly #recordedAnswers: RecordedAnswersService;

  constructor() {
    this.#recordedAnswers = inject(RecordedAnswersService);
  }

  copy(): void {
    const answers = this.#recordedAnswers.answers();

    const content = answers()
      .map((answer) => answer.receivedScore)
      .map(String)
      .join(" ");

    globalThis.navigator.clipboard.writeText("Anno't\n" + content);
  }
}
