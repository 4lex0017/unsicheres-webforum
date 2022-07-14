import {Component, OnInit} from '@angular/core';
import {
  VulnerabilityDifficultyOverview,
  VulnerabilityDifficultyOverviewPackage
} from "../../data-access/models/vulnerabilityDifficultyOverview";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogShowCurrentConfigComponent
} from "../dialog/dialog-show-current-config/dialog-show-current-config.component";

import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {VulnerabilitiesConfig} from "../../data-access/models/vulnerabilitiesConfig";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";


@Component({
  selector: 'app-vulnerabilities',
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent implements OnInit {
  vulnerabilities$: Observable<VulnerabilityDifficultyOverviewPackage>;
  currentConfig: VulnerabilitiesConfig;
  curVulnerabilities: VulnerabilityDifficultyOverviewPackage = {vulnerabilities: []};

  constructor(private dialog: MatDialog,
              private router: Router,
              private backendCom: BackendCommunicationService,
              private diffPicker: DifficultyPickerService,
              private _snackBar: MatSnackBar) {
  }


  async setVuln() {
    this.backendCom.getVulnerabilities().subscribe((data) => this.curVulnerabilities = data);
  }

  ngOnInit(): void {
    this.setVuln()
    this.backendCom.getVulnerabilitiesConfig().subscribe(data => {
      this.currentConfig = data;
    })
  }

  updateToDatabase(): void {
    this.backendCom.putVulnerabilitiesConfig(this.curVulnerabilities).subscribe(resp => {
      this.currentConfig = resp;
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "New config loaded successfully",
      })

    }, error => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Failed loading config.",
      })
    })
  }

  goToMain() {
    this.router.navigate(['/forum'])
  }

  showCurrentConfig() {
    this.dialog.open(DialogShowCurrentConfigComponent, {
      width: '70%',
      data: this.currentConfig
    });
  }

  updateVulnerability(data: VulnerabilityDifficultyOverview): void {

    for (let v of this.curVulnerabilities.vulnerabilities) {
      if (v.id == data.id) {
        v = data;
        break;
      }
    }
  }

  resetDatabase() {
    this.backendCom.resetDatabase().subscribe(value => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Database has been reset.",
      })
    });
  }
}
