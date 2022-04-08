import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ThemeService} from "../../theme.service";
import {Router} from "@angular/router";

@Component({
  selector: 'admin-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  constructor(private themeService:ThemeService) {
    this.themeService.initTheme();
    this.isDarkMode = this.themeService.isDarkMode();
  }

  ngOnInit(): void {
  }
  isDarkMode = true;
  toggleDarkMode(){
    this.isDarkMode = this.themeService.isDarkMode();
    this.isDarkMode? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }
}
