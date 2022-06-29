import {Component, Inject} from "@angular/core";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {ForumComponent} from "../../user-home/forum/forum.component";

@Component({
  selector: 'app-dialog-report-post',
  templateUrl: './dialog-report-post.component.html',
  styleUrls: ['./dialog-report-post.component.scss']
})
export class DialogReportPostComponent {
  constructor(
    public dialogRef: MatDialogRef<ForumComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ReportPostData
  ) {
  }

  onNoClick(): void {
    this.dialogRef.close();
  }
}

export interface ReportPostData {
  content: string;
}

