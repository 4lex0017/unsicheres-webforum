import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ThemeService} from "../../theme.service";
import {BackendService} from "../../data-access/services/backend.service";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {SnackBarNotificationComponent} from "../snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username;

  constructor(private http: HttpClient, private router: Router, private backendCom: BackendCommunicationService, private _snackBar: MatSnackBar) {
  }


  handleLoginClick() {
    if (this.username) {
      this.backendCom.setAttackername(this.username).subscribe();
      this.router.navigate(['/forum']);
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
