import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {ToolbarComponent} from "../toolbar/toolbar.component";
import {BackendService} from "../../../../data-access/services/backend.service";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-register',
  templateUrl: './dialog-register.component.html',
  styleUrls: ['./dialog-register.component.scss']
})

export class DialogRegisterComponent {
  bar: ToolbarComponent;
  hide: boolean = true;
  //Switch to Validators maybe (team question)
  username: string;
  password: string;
  passwordRepeat: string;

  // passwordError: boolean = false;
  // passwordErrorMessage: string = "";
  //
  // fillError: boolean = false;
  // usernameErrorMessage: string = "";

  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    private backend: BackendService,
    private _snackBar: MatSnackBar) {
  }

  registerUser(): void {
    if (this.username && this.password && this.passwordRepeat) {
      if (this.password == this.passwordRepeat) {
        if (this.backend.checkRegisterUserExists(this.username)) {
          this.username = "";
          this.password = "";
          this.passwordRepeat = "";
          this._snackBar.openFromComponent(SnackBarNotificationComponent, {
            duration: 5000,
            data: "User already exists.",
          });
        } else {
          this.createNewUser(this.username, this.password)
          sessionStorage.setItem("user", this.username)
          this.dialogref.close();
        }

      } else {
        // this.passwordErrorMessage = "Passwords do not match";
        // this.passwordError = true;
        this.password = "";
        this.passwordRepeat = "";
        this._snackBar.openFromComponent(SnackBarNotificationComponent, {
          duration: 5000,
          data: "Passwords do not match",
        })
      }
    } else {
      // this.fillError = true;
      // this.usernameErrorMessage = "Please fill out all fields";
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "Please fill out all fields",
      })
    }
  }

  createNewUser(userName, userPassword) {
    this.backend.loginData.loginData.push(userName, userPassword);
  }

  close(): void {
    this.dialogref.close();
  }
}
