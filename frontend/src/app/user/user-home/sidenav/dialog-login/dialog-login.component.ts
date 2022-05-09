import {Component, Inject, ViewEncapsulation} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {BackendService} from "../../../../data-access/services/backend.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";


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
    private backend: BackendService,
    private _snackBar: MatSnackBar,
    private authenticate: AuthenticationService
  ) {
  }

  checkLogin(): void {
    if (this.username && this.password) {
      this.authenticateUser(this.username, this.password);
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

  authenticateUser(userName, password) {
    let response = this.backend.checkLoginData(userName, password);
    if (response == 1) {
      sessionStorage.setItem("user", userName);
      this.authenticate.login(userName, password);
      this.dialogRef.close();
    } else if (response == -1) {
      this.username = "";
      this.password = "";
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {duration: 5000, data: "User doesn't exist."});
    } else {
      this.password = "";
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Wrong password."
      });
    }
  }

  close(): void {
    this.dialogRef.close();
  }
}
