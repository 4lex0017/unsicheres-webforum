import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserThreadViewComponent} from "../../../user/user-thread-view/user-thread-view.component";
import {UserFull} from "../../../data-access/models/userFull";
import {UserProfileViewComponent} from "../user-profile-view.component";

@Component({
  selector: 'app-dialog-edit-profile',
  templateUrl: './dialog-edit-profile.component.html',
  styleUrls: ['./dialog-edit-profile.component.scss']
})
export class DialogEditProfileComponent  {
  constructor(
    public dialogRef: MatDialogRef<UserProfileViewComponent>,
    @Inject(MAT_DIALOG_DATA) public data: UserFull,
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
