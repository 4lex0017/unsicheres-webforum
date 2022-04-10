import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {ThemeService} from "./theme.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Prototype';

  constructor(private themeService : ThemeService) {
    this.themeService.initTheme();
  }
}
