import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserThreadViewComponent} from "../user-thread-view.component";
import {Post} from "../../../data-access/models/post";

@Component({
  selector: 'app-dialog-delete-post',
  templateUrl: './dialog-delete-post.component.html',
  styleUrls: ['./dialog-delete-post.component.scss']
})
export class DialogDeletePostComponent {

  constructor(
    public dialogRef: MatDialogRef<UserThreadViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
