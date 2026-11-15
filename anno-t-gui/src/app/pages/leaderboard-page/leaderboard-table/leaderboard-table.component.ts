import type { HttpResourceRef } from "@angular/common/http";
import { Component, computed, inject, type Signal } from "@angular/core";
import { toObservable, toSignal } from "@angular/core/rxjs-interop";
import {
  LeaderboardResource,
  type Leaderboard,
  type LeaderboardRecord,
} from "@anno-t/generated-openapi";
import { map, of, switchMap, timer } from "rxjs";

@Component({
  imports: [],
  selector: "app-leaderboard-table",
  styleUrl: "./leaderboard-table.component.css",
  templateUrl: "./leaderboard-table.component.html",
})
export class LeaderboardTableComponent {
  protected readonly leaderboardResource: HttpResourceRef<Leaderboard | undefined>;
  protected readonly showLoading: Signal<boolean>;

  readonly #leaderboardResource: LeaderboardResource;

  constructor() {
    this.#leaderboardResource = inject(LeaderboardResource);
    this.leaderboardResource = this.#leaderboardResource.getLeaderboard();

    this.showLoading = toSignal(
      toObservable(this.leaderboardResource.isLoading).pipe(
        switchMap((loading) => (loading ? timer(150).pipe(map(() => true)) : of(false))),
      ),
      { initialValue: false },
    );
  }
}
