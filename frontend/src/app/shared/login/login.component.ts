import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {SnackBarNotificationComponent} from "../snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {MatDialog} from "@angular/material/dialog";
import {CookieService} from "ngx-cookie-service";
import {DialogFirstLoginComponent} from "../dialog/dialog-first-login/dialog-first-login.component";
import {DialogHasCookieComponent} from "../dialog/dialog-has-cookie/dialog-has-cookie.component";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  username: string;

  constructor(private http: HttpClient,
              private router: Router,
              private backendCom: BackendCommunicationService,
              private _snackBar: MatSnackBar,
              private dialog: MatDialog,
              private cookieService: CookieService) {
  }


  handleLoginClick() {
    if (this.cookieService.check('tracker')) {
      this.router.navigate(['/forum']);
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Already logged in, skipped login."
      });
      return;
    }
    if (this.username) {
      this.backendCom.setAttackername(this.username).subscribe(value => {
        this.router.navigate(['/forum']);
        this.dialog.open(DialogFirstLoginComponent, {
          width: '60%',
        });
      }, error => {
        if (error.value == 422) {
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            panelClass: ['snack-bar-background'],
            data: "This Username is already taken."
          });
          this.username = "";
        }
        return;
      });

    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Choose a Username."
      });
    }
  }

  openAdminLogin(): void {
    this.router.navigate(['/adminLogin'])
  }

  ngOnInit(): void {
    if (this.cookieService.check('tracker')) {
      const dialogRef = this.dialog.open(DialogHasCookieComponent, {
        width: '60%',
      });
    }
  }
}
