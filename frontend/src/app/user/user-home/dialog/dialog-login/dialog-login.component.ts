import {Component} from "@angular/core";
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogRegisterComponent} from "../dialog-register/dialog-register.component";
import {ToolbarComponent} from "../../sidenav/toolbar/toolbar.component";
import {DidAThingServiceService} from "../../../../shared/did-a-thing/did-a-thing-service.service";


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
    private dialog: MatDialog,
    private didAThing: DidAThingServiceService
  ) {
  }

  openRegister(): void {
    this.dialogRef.close();
    this.dialog.open(DialogRegisterComponent, {
      width: '30%'
    });
  }

  checkLogin(): void {
    if (this.username && this.password) {
      this.authenticateUserNew(this.username, this.password);
    } else if (this.username && !this.password) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Please enter a password."
      });
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Please enter username & password."
      });
    }
  }


  authenticateUserNew(userName, password) {
    this.authenticate.loginJwt(userName, password).subscribe(data => {
      if (data['headers'].get('vulnfound') == "true") {
        this.didAThing.sendMessage();
      }
      this.dialogRef.close();
    }, error => {
      let errorMessage = "Invalid data.";
      if (error.status == 400) {
        this.username = "";
        this.password = "";
      } else {
        errorMessage = "Wrong password.";
        this.password = "";
      }
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: errorMessage
      });
    });
  }


  close(): void {
    this.dialogRef.close();
  }
}
