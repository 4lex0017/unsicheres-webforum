import {Component} from '@angular/core';
import {Router} from '@angular/router';
import {ThemeService} from "./theme.service";
import {DifficultyPickerService} from "./data-access/services/difficulty-picker.service";
import {BackendService} from "./data-access/services/backend.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Prototype';

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
  }
}
