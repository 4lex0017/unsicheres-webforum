import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserThreadViewComponent} from "../user-thread-view.component";
import {Post} from "../../../data-access/models/post";

@Component({
  selector: 'app-dialog-edit-post',
  templateUrl: './dialog-edit-post.component.html',
  styleUrls: ['./dialog-edit-post.component.scss']
})
export class DialogEditPostComponent {

  constructor(
    public dialogRef: MatDialogRef<UserThreadViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Post,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}
