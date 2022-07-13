import {Component} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogRegisterComponent} from "../dialog-register/dialog-register.component";
import {ToolbarComponent} from "../../sidenav/toolbar/toolbar.component";


@Component({
  selector: 'app-dialog-login',
  templateUrl: './dialog-login.component.html',
  styleUrls: ['./dialog-login.component.scss']
})
export class DialogLoginComponent {
  bar: ToolbarComponent;
  hide = true;
  username: string;
  password: string;

  constructor(
    public dialogRef: MatDialogRef<DialogLoginComponent>,
    private _snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private dialog: MatDialog
  ) {
  }

  openRegister(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(DialogRegisterComponent, {
      width: '30%'
    });
  }

  checkLogin(): void {
    if (this.username && this.password) {
      this.authenticateUserNew(this.username, this.password);
    } else if (this.username && !this.password) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please enter a password."
      });
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please enter username & password."
      });
    }
  }


  authenticateUserNew(userName, password) {
    this.authenticate.loginJwt(userName, password).subscribe(data => {
      console.log(data)
      this.dialogRef.close();
    }, error => {
      this.username = "";
      this.password = "";
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Invalid data."
      });
    });
  }


  close(): void {
    this.dialogRef.close();
  }
}
