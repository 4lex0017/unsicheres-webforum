import {Component} from "@angular/core";
import {ThemeService} from "../../theme.service";

@Component({
  selector:'app-user-settings',
  templateUrl: './user-settings.component.html',
  styleUrls: ['./user-settings.component.scss']
  }
)

export class UserSettingsComponent{

  constructor(private themeService: ThemeService) {
    this.themeService.initTheme();
    this.darkMode = this.themeService.isDarkMode();
  }
  darkMode = true

  toggleDarkMode() {
    this.darkMode = this.themeService.isDarkMode();
    this.darkMode ? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }
}
