import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ThemeService} from "../../theme.service";
import {AuthenticationServiceAdmin} from "../../data-access/services/authenticationAdmin";

@Component({
  selector: 'admin-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  title = 'Admin';
  sideNavigationMaximized = true;
  contentMargin = 240;

  constructor(private router: Router, private themeService: ThemeService, private authAdmin: AuthenticationServiceAdmin) {
    this.themeService.initTheme();

  }

  toggleSideNav() {
    this.sideNavigationMaximized = !this.sideNavigationMaximized;
    if (!this.sideNavigationMaximized) {
      this.contentMargin = 70;
    } else {
      this.contentMargin = 210;
    }
  }

  logout() {
    this.authAdmin.logoutAdmin();
    this.router.navigate(['/login'])
  }
}
