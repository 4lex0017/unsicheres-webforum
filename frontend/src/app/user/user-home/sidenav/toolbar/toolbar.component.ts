import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {ThemeService} from "../../../../theme.service";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogLoginComponent} from "../../dialog/dialog-login/dialog-login.component";
import {DialogRegisterComponent} from "../../dialog/dialog-register/dialog-register.component";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent {

  constructor(private dialog: MatDialog,
              private router: Router,
              private themeService: ThemeService,
              public authenticate: AuthenticationService) {
    this.darkMode = this.themeService.isDarkMode();
  }

  darkMode: boolean;

  logout(): void {
    sessionStorage.removeItem("user");
    this.authenticate.logout();
  }

  navigateProfile(): void {
    this.router.navigate(['/forum/users', this.authenticate.currentUserId]);
  }

  openLogin(): void {
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      width: '30%',
    });
  }

  openRegister(): void {
    const dialogRef = this.dialog.open(DialogRegisterComponent, {
      width: '30%'
    });
  }

  toggleDarkMode() {
    this.darkMode = this.themeService.isDarkMode();
    this.darkMode ? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }

}