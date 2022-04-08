import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {ThemeService} from "../../theme.service";

@Component({
  selector: 'admin-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  title = 'Prototype';
  sideNavigationMaximized = true;
  contentMargin = 240;

  constructor(private router: Router, private themeService : ThemeService) {
    this.themeService.initTheme();

  }
  toggleSideNav(){
    this.sideNavigationMaximized = !this.sideNavigationMaximized;
    if(!this.sideNavigationMaximized) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 210;
    }
  }

}
