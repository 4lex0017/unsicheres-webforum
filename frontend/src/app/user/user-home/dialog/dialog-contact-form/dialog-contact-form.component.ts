import {Component} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {FormControl, Validators} from "@angular/forms";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {DialogContactFormDismissComponent} from "../dialog-contact-form-dismiss/dialog-contact-form-dismiss.component";

@Component({
  selector: 'app-dialog-contact-form',
  templateUrl: './dialog-contact-form.component.html',
  styleUrls: ['./dialog-contact-form.component.scss']
})
export class DialogContactFormComponent {
  constructor(
    public dialogRef: MatDialogRef<ForumComponent>,
    private _snackBar: MatSnackBar,
    private dialog: MatDialog) {
  }

  email = new FormControl('', [Validators.required, Validators.email]);
  topic: string;
  message: string;

  public checkFile(): void {
    if (this.email && this.topic && this.message) {
      this.dialogRef.close();
      this.openDismissMessage();
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


  public close(): void {
    this.dialogRef.close();
  }

  openDismissMessage(): void {
    this.dialogRef.close();
    const dialogRef = this.dialog.open(DialogContactFormDismissComponent, {
      width: '65%',
      data: this.message,
    });
  }
}
