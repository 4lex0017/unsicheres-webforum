import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {ThemeService} from "../../theme.service";
import {BackendService} from "../../data-access/services/backend.service";
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
      return;
    }
    if (this.username) {
      this.backendCom.setAttackername(this.username).subscribe(value => {
        this.router.navigate(['/forum']);
        this.dialog.open(DialogFirstLoginComponent, {
          width: '60%',
        });
      }, error => {
        if (error.status == 422) {
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            data: "This Username is already taken."
          });
          this.username = "";
        }
        return;
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

  ngOnInit(): void {
    console.log(this.cookieService.check('tracker'))
    console.log(this.cookieService.get('tracker'))
    if (this.cookieService.check('tracker')) {
      const dialogRef = this.dialog.open(DialogHasCookieComponent, {
        width: '60%',
      });
    }
  }
}
