import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VulnerabilitiesConfig} from "../../../data-access/models/vulnerabilitiesConfig";

@Component({
  selector: 'app-dialog-show-current-config',
  templateUrl: './dialog-show-current-config.component.html',
  styleUrls: ['./dialog-show-current-config.component.scss']
})
export class DialogShowCurrentConfigComponent {

  constructor(
    public dialogRef: MatDialogRef<string>,
    @Inject(MAT_DIALOG_DATA) public data: VulnerabilitiesConfig = {data: [], hash_difficulty: -1},
  ) {
  }


  close(): void {
    this.dialogRef.close();
  }
}
