import {Component} from '@angular/core';
import {ThemeService} from "../../theme.service";

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent {
  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }


  isDarkMode = true;

  toggleDarkMode() {
    this.isDarkMode = this.themeService.isDarkMode();
    this.isDarkMode ? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }
}
