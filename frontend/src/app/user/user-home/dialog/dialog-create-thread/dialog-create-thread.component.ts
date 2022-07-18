import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../forum/forum.component";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-dialog-create-thread',
  templateUrl: './dialog-create-thread.component.html',
  styleUrls: ['./dialog-create-thread.component.scss']
})
export class DialogCreateThreadComponent {
  constructor(
    public dialogRef: MatDialogRef<ForumComponent>,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: CreateThreadData
  ) {
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
    if (this.data.category == "") {
      error = "Please pick a Category.";
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

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface CreateThreadData {
  content: string;
  title: string;
  category: string
}
