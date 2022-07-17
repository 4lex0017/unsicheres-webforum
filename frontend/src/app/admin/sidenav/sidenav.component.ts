import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {ThemeService} from "../../theme.service";
import {AuthenticationServiceAdmin} from "../../data-access/services/authenticationAdmin";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss']
})
export class SidenavComponent {
  title = 'Admin Panel';
  sideNavigationMaximized = true;
  contentMargin = 240;
  darkMode: boolean;

  constructor(private router: Router,
              private themeService: ThemeService,
              private authAdmin: AuthenticationServiceAdmin,
              private backendCom: BackendCommunicationService,
              private _snackBar: MatSnackBar) {
    this.themeService.initTheme();
    this.darkMode = this.themeService.isDarkMode();

  }

  toggleDarkMode() {
    this.darkMode = this.themeService.isDarkMode();
    this.darkMode ? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }

  resetDatabase() {
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      panelClass: ['snack-bar-background'],
      data: "Resetting database, please wait ...",
    })
    this.backendCom.resetDatabase().subscribe(value => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Database has been reset. Logging out ...",
      })
    });
  }

  resetScoreboard() {
    this.backendCom.resetScoreboard().subscribe(value => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Scoreboard has been reset. Logging out ...",
      })
      this.authAdmin.logoutAdmin();
      this.router.navigate(['/userLogin'])
    });
  }


  logout() {
    this.authAdmin.logoutAdmin();
    this.router.navigate(['/userLogin'])
  }
}
