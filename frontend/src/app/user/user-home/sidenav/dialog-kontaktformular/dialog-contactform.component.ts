import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {BackendService} from "../../../../data-access/services/backend.service";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {FormControl, Validators} from "@angular/forms";

@Component({
  selector: 'app-dialog-formular',
  templateUrl: './dialog-contactform.component.html',
  styleUrls: ['./dialog-contactform.component.scss']
})

export class DialogContactformComponent {
  constructor(
    public dialogref: MatDialogRef<ForumComponent>,
    private backend: BackendService,
    private _snackBar: MatSnackBar) {
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  topic: string;
  message: string;

  public checkFile(): void {
    if (this.email && this.topic && this.message) {
      this.sendFile(this.email, this.topic, this.message);
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: 'Success! We will message you as soon as possible.'
      });
      this.dialogref.close();
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: 'Please fill out every field.'
      });
    }
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'You must enter a email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

  public sendFile(username, topic, message) {
    this.backend.contactForms.Forms.push(username, topic, message);
  }

  public close(): void {
    this.dialogref.close();
  }
}
