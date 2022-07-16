import {Component} from '@angular/core';
import {ThemeService} from "./theme.service";
import {DifficultyPickerService} from "./data-access/services/difficulty-picker.service";


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Forum';

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
    // this.themeService.update('dark-mode');
  }
}
