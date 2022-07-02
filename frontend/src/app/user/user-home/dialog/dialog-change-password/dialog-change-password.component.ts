import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {BackendService} from "../../../../data-access/services/backend.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DatePipe} from "@angular/common";
import {BackendCommunicationService} from "../../../../data-access/services/backend-communication.service";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";

@Component({
  selector: 'app-dialog-change-password',
  templateUrl: './dialog-change-password.component.html',
  styleUrls: ['./dialog-change-password.component.scss']
})
export class DialogChangePasswordComponent {

  constructor(public dialogref: MatDialogRef<ForumComponent>,
              private backend: BackendService,
              private _snackBar: MatSnackBar,
              private backendCom: BackendCommunicationService,
              private auth: AuthenticationService) {
  }

  password: string;
  passwordRepeat: string;
  hide: boolean = true;


  close(): void {
    this.dialogref.close();
  }

  change(): void {
    if (!this.password) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please enter a new password.",
      });
    } else if (this.password != this.passwordRepeat) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Passwords do not match.",
      });
      this.password = "";
      this.passwordRepeat = "";
    } else {
      this.backendCom.putUserPassword(this.auth.getCurrentUserId(), this.password).subscribe(value => {
        console.log(value.status)
        if (value.status == 200) {
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            data: "Password changed successfully!",
          });
          this.dialogref.close();
        }
      }, error => {
        this._snackBar.openFromComponent(SnackBarNotificationComponent, {
          duration: 5000,
          data: "Ooops, something went wrong.",
        });
        this.password = "";
        this.passwordRepeat = "";
      })
    }
  }
}
