import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../snack-bar-notification/snack-bar-notification.component";


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  username;
  password;

  constructor(private http: HttpClient,
              private router: Router,
              private _snackBar: MatSnackBar) {
  }


  handleLoginClick() {
    if (this.username && this.password) {
      this.authenticateUser(this.username);
    } else if (this.username && !this.password){
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data:"Please enter a password"
      })
    }else{
      this._snackBar.openFromComponent(SnackBarNotificationComponent,{
        duration: 5000,
        data:"Please enter username & password"
      });
    }
  }

  openAdminLogin(): void {
    this.router.navigate(['/adminlogin'])
  }


  authenticateUser(userName) {
    sessionStorage.setItem("upperUser", userName);
    this.router.navigate(['/forum']);
  }

}
