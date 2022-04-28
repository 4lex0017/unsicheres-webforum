import {Component, HostListener, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {UserThreadViewComponent} from "../../user-thread-view/user-thread-view.component";
import {Thread} from "../../../data-access/models/thread";
import {ForumComponent} from "../forum/forum.component";

@Component({
  selector: 'app-dialog-create-thread',
  templateUrl: './dialog-create-thread.component.html',
  styleUrls: ['./dialog-create-thread.component.scss']
})
export class DialogCreateThreadComponent  {
  constructor(
    public dialogRef: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: CreateThreadData
  ) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface CreateThreadData {
  content: string;
  title: string;
  category:string
}
