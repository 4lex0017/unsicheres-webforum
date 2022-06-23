import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {BackendService} from "../../../../data-access/services/backend.service";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogLoginComponent} from "../dialog-login/dialog-login.component";
import {ToolbarComponent} from "../../sidenav/toolbar/toolbar.component";
import {DatePipe} from "@angular/common";
import {FormControl, Validators} from "@angular/forms";
import {UserFull} from "../../../../data-access/models/userFull";
import {BackendCommunicationService} from "../../../../data-access/services/backend-communication.service";

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})

export class DialogRegisterComponent {
  bar: ToolbarComponent;
  hide: boolean = true;
  //Switch to Validators maybe (team question)
  startDate = new Date(1995, 0, 1);
  username: string;
  password: string;
  passwordRepeat: string;
  date = new FormControl(null, Validators.required);

  // passwordError: boolean = false;
  // passwordErrorMessage: string = "";
  //
  // fillError: boolean = false;
  // usernameErrorMessage: string = "";

  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    private backend: BackendService,
    private _snackBar: MatSnackBar,
    private authenticate: AuthenticationService,
    private dialog: MatDialog,
    private datePipe: DatePipe,
    private backendCom: BackendCommunicationService) {
  }

  registerUser(): void {
    if (this.username && this.password && this.passwordRepeat && this.date.value) {
      if (this.password == this.passwordRepeat) {
        // if (this.backend.checkRegisterUserExists(this.username)) {
        //   this.username = "";
        //   this.password = "";
        //   this.passwordRepeat = "";
        //   this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        //     duration: 5000,
        //     data: "User already exists.",
        //   });
        // } else {
        // this.createNewUser(this.username, this.password, this.formatDate(this.date.value))
        // sessionStorage.setItem("user", this.username)
        this.authenticate.registerJwt(this.username, this.password, this.date.value).subscribe(d => this.dialogref.close(), error => {
          console.log(error)
          console.log(error.status)
          let errorMsg = "Bad request.";
          if (error.status == 500) {
            errorMsg = "User already exists.";
          }
          this.username = "";
          this.password = "";
          this.passwordRepeat = "";
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            data: errorMsg,
          });

        });

        // }
      } else {
        this.password = "";
        this.passwordRepeat = "";
        this._snackBar.openFromComponent(SnackBarNotificationComponent, {
          duration: 5000,
          data: "Passwords do not match",
        })
      }
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please fill out all fields",
      })
    }
  }

  createNewUser(userName, userPassword, date) {
    this.backend.registerNewUser(userName, userPassword, date);  //DELETE later
    let user = {
      "name": userName,
      "password": userPassword,
      "birth_date": date,
      "about": "",
      "groups": [
        "Member"
      ],
      "profile_comments": []
    }
    this.backendCom.postUser(user).subscribe(response => {
      // this.authenticate.currentUserId = response.data.id;
    });
  }

  close(): void {
    this.dialogref.close();
  }

  openLogin(): void {
    this.dialogref.close();
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      width: '30%'
    });
  }

  formatDate(data: Date): string {
    return this.datePipe.transform(data, 'dd.MM.yyyy')!;
  }
}
