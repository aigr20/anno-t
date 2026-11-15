import { Component } from "@angular/core";
import { BaseLayoutComponent } from "@anno-t/common/base-layout/base-layout.component";
import { LeaderboardTableComponent } from "./leaderboard-table/leaderboard-table.component";

@Component({
  imports: [BaseLayoutComponent, LeaderboardTableComponent],
  selector: "app-leaderboard-page",
  styleUrl: "./leaderboard-page.component.css",
  templateUrl: "./leaderboard-page.component.html",
})
export class LeaderboardPageComponent {}
