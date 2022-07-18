import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserThreadViewComponent} from "../user-thread-view.component";
import {Thread} from "../../../data-access/models/thread";
import {SnackBarNotificationComponent} from "../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-edit-thread',
  templateUrl: './dialog-edit-thread.component.html',
  styleUrls: ['./dialog-edit-thread.component.scss']
})
export class DialogEditThreadComponent {
  constructor(
    public dialogRef: MatDialogRef<UserThreadViewComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: Thread,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onYesClick(): void {
    let error = "";
    if (this.data.title.length < 10) {
      error = "Title too short! At least 10 characters.";
    }
    if (this.data.title == "") {
      error = "Please pick a title."
    }
    if (this.data.title.length > 150) {
      error = "Title too long! < 150 characters!"
      this.data.title = "";
    }
    if (error != "") {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: error,
      });
      return;
    }
    this.dialogRef.close(this.data);
  }
}

