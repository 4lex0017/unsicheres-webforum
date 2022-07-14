import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserProfileViewComponent} from "../user-profile-view.component";
import {SnackBarNotificationComponent} from "../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-create-comment',
  templateUrl: './dialog-create-comment.component.html',
  styleUrls: ['./dialog-create-comment.component.scss']
})
export class DialogCreateCommentComponent {

  constructor(
    public dialogRef: MatDialogRef<UserProfileViewComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onCreate(): void {
    if (this.data.length < 5) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Content length must be at least 5 characters."
      });
    } else {
      this.dialogRef.close(this.data);
    }
  }
}


