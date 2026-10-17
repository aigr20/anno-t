import { Service } from "@angular/core";

@Service()
export class GameHistoryService {
  hasPlayedToday(): boolean {
    return false;
  }
}
