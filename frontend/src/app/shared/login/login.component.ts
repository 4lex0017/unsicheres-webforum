import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ThemeService} from "../../theme.service";
import {BackendService} from "../../data-access/services/backend.service";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {SnackBarNotificationComponent} from "../snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogChangePasswordComponent
} from "../../user/user-home/dialog/dialog-change-password/dialog-change-password.component";
import {DialogFirstLoginComponent} from "../dialog-first-login/dialog-first-login.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username;

  constructor(private http: HttpClient,
              private router: Router,
              private backendCom: BackendCommunicationService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog) {
  }


  handleLoginClick() {
    if (this.username) {
      this.backendCom.setAttackername(this.username).subscribe();
      this.router.navigate(['/forum']);
      const dialogRef = this.dialog.open(DialogFirstLoginComponent, {
        width: '60%',
      });
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Choose a Username."
      });
    }
  }

  openAdminLogin(): void {
    this.router.navigate(['/adminLogin'])
  }
}
