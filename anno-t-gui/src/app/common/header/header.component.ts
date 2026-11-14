import { Component, computed, inject, type Signal } from "@angular/core";
import { isActive, Router, RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: "app-header",
  styleUrl: "./header.component.css",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {
  protected readonly isGameActive: Signal<boolean>;

  constructor() {
    const router = inject(Router);
    const rootActive = isActive("/", router, { paths: "exact" });
    const gameWithChildrenActive = isActive("/game", router);
    this.isGameActive = computed(() => {
      return rootActive() || gameWithChildrenActive();
    });
  }
}
