import { Component } from "@angular/core";
import { HeaderComponent } from "../header/header.component";

@Component({
  imports: [HeaderComponent],
  selector: "app-base-layout",
  styleUrl: "./base-layout.component.css",
  templateUrl: "./base-layout.component.html",
})
export class BaseLayoutComponent {}
