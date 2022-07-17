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
    @Inject(MAT_DIALOG_DATA) public data: VulnerabilitiesConfig = {
      data: [],
      hash_difficulty: -1,
      user_difficulty: -1,
      rate_difficulty: -1,
      hint_difficulty: -1
    },
  ) {
  }

  mapOfFour = new Map<number, string>([[1, "Easy"], [2, 'Medium'], [3, 'Hard'], [4, 'Impossible']]);
  mapOfTwo = new Map<number, string>([[1, "Not Active"], [2, 'Active']]);
  mapOThreeHard = new Map<number, string>([[1, "Easy"], [2, 'Medium'], [3, 'Hard']]);
  mapOThreeOff = new Map<number, string>([[1, "Easy"], [2, 'Medium'], [3, 'Off']]);
  mapOThreeImp = new Map<number, string>([[1, "Easy"], [2, 'Medium'], [3, 'Impossible']]);

  close(): void {
    this.dialogRef.close();
  }
}
