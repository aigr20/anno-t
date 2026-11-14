import { Component } from "@angular/core";
import { RouterLink, RouterLinkActive } from "@angular/router";

@Component({
  imports: [RouterLink, RouterLinkActive],
  selector: "app-header",
  styleUrl: "./header.component.css",
  templateUrl: "./header.component.html",
})
export class HeaderComponent {}
