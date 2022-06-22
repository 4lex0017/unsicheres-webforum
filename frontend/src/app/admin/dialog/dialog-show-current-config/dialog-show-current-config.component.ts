import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {DifficultyPickerService} from "../../../data-access/services/difficulty-picker.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {VulnerabilitiesConfig} from "../../../data-access/models/vulnerabilitiesConfig";
import {Observable} from "rxjs";
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";

@Component({
  selector: 'app-dialog-show-current-config',
  templateUrl: './dialog-show-current-config.component.html',
  styleUrls: ['./dialog-show-current-config.component.scss']
})
export class DialogShowCurrentConfigComponent implements OnInit {

  constructor(
    private changeDetectorRef: ChangeDetectorRef,
    private diffPicker: DifficultyPickerService,
    public dialogRef: MatDialogRef<string>,
    private backendCom: BackendCommunicationService,
    @Inject(MAT_DIALOG_DATA) public data: VulnerabilitiesConfig,
  ) {
  }

  config$: Observable<VulnerabilitiesConfig>

  ngOnInit(): void {
    this.config$ = this.backendCom.getVulnerabilitiesConfig()
  }

  close(): void {
    this.dialogRef.close();
  }
}
