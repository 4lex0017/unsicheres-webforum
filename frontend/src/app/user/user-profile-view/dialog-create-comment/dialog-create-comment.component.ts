import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserProfileViewComponent} from "../user-profile-view.component";

@Component({
  selector: 'app-dialog-create-comment',
  templateUrl: './dialog-create-comment.component.html',
  styleUrls: ['./dialog-create-comment.component.scss']
})
export class DialogCreateCommentComponent {

  constructor(
    public dialogRef: MatDialogRef<UserProfileViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: string
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}


