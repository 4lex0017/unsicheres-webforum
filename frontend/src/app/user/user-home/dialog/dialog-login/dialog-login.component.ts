import {Component, Inject, ViewEncapsulation} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";

import {BackendService} from "../../../../data-access/services/backend.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogRegisterComponent} from "../dialog-register/dialog-register.component";
import {DifficultyPickerService} from "../../../../data-access/services/difficulty-picker.service";
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
    private backend: BackendService,
    private _snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private dialog: MatDialog,
    private diffPicker: DifficultyPickerService
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

  // authenticateUser(userName, password) {
  //   let response = this.backend.checkLoginData(userName, password);
  //   if (response == 1) {
  //     sessionStorage.setItem("user", userName);
  //     this.authenticate.loginJwt(userName, password);
  //     this.dialogRef.close();
  //   } else if (response == -1) {
  //     let responseMessage = "User doesn't exist.";
  //     if (!this.diffPicker.isEnabled(2, 1) && !this.diffPicker.isEnabled(2, 2)) responseMessage = "Invalid data.";
  //     this.username = "";
  //     this.password = "";
  //     this._snackBar.openFromComponent(SnackBarNotificationComponent, {duration: 5000, data: responseMessage});
  //   } else {
  //     let responseMessage = "Wrong password.";
  //     if (!this.diffPicker.isEnabled(2, 1) && !this.diffPicker.isEnabled(2, 2)) {
  //       responseMessage = "Invalid data.";
  //       this.username = "";
  //     }
  //     this.password = "";
  //     this._snackBar.openFromComponent(SnackBarNotificationComponent, {
  //       duration: 5000,
  //       data: responseMessage
  //     });
  //   }
  // }

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


    // this.username = "";
    // this.password = "";
    // this._snackBar.openFromComponent(SnackBarNotificationComponent, {
    //   duration: 5000,
    //   data: "Invalid data."
    // });

  }


  close(): void {
    this.dialogRef.close();
  }
}
