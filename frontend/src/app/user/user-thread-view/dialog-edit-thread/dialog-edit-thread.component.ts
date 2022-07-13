import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserThreadViewComponent} from "../user-thread-view.component";
import {Thread} from "../../../data-access/models/thread";

@Component({
  selector: 'app-dialog-edit-thread',
  templateUrl: './dialog-edit-thread.component.html',
  styleUrls: ['./dialog-edit-thread.component.scss']
})
export class DialogEditThreadComponent {
  constructor(
    public dialogRef: MatDialogRef<UserThreadViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Thread,
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

