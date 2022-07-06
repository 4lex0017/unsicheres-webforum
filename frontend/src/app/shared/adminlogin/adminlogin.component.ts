import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../snack-bar-notification/snack-bar-notification.component";
import {AuthenticationServiceAdmin} from "../../data-access/services/authenticationAdmin";


@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminLoginComponent {
  adminname: string;
  password: string;

  constructor(private http: HttpClient,
              private router: Router,
              private _snackBar: MatSnackBar,
              private authAdmin: AuthenticationServiceAdmin) {
  }

  handleLoginClick() {
    if (this.adminname && this.password) {
      this.authenticateAdmin();
    } else if (this.adminname && !this.password) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please enter a password."
      });
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please enter adminname & password."
      });

    }
  }

  authenticateAdmin() {
    this.authAdmin.loginJwtAdmin(this.adminname, this.password).subscribe(data => {
      console.log(data)
      this.router.navigate(['/admin']);
    }, error => {
      this.adminname = "";
      this.password = "";
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Invalid data."
      });
    })

    // sessionStorage.setItem("upperUser", this.adminname);
    // if (this.adminname == "admin") {
    //   this.router.navigate(['/admin']);
    // }
  }


  openUserLogin() {
    this.router.navigate(['/userLogin'])
  }
}
