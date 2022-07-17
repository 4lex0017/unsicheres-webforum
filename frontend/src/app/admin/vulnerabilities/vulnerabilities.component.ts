import {Component, OnInit} from '@angular/core';
import {
  VulnerabilityDifficultyOverview,
  VulnerabilityDifficultyOverviewPackage
} from "../../data-access/models/vulnerabilityDifficultyOverview";
import {Router} from "@angular/router";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogShowCurrentConfigComponent
} from "../dialog/dialog-show-current-config/dialog-show-current-config.component";

import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {VulnerabilitiesConfig} from "../../data-access/models/vulnerabilitiesConfig";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {AuthenticationServiceAdmin} from "../../data-access/services/authenticationAdmin";


@Component({
  selector: 'app-vulnerabilities',
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent implements OnInit {
  currentConfig: VulnerabilitiesConfig;
  curVulnerabilities: VulnerabilityDifficultyOverviewPackage = {vulnerabilities: []};
  helperPostStatus: number = -1;
  mapOThree = new Map<number, string>([[-1, "Loading status"], [0, 'Helper Posts not active'], [1, 'Helper Posts active']]);
  btnColour = '#0c5fcb';

  constructor(private dialog: MatDialog,
              private router: Router,
              private backendCom: BackendCommunicationService,
              private diffPicker: DifficultyPickerService,
              private _snackBar: MatSnackBar,
              private authAdmin: AuthenticationServiceAdmin) {
  }


  async setVuln() {
    this.backendCom.getVulnerabilities().subscribe((data) => {
      this.curVulnerabilities = data;
      if (this.curVulnerabilities.vulnerabilities[8].subtasks[1].checked) {
        this.helperPostStatus = 1;
      } else {
        this.helperPostStatus = 0;
      }
    });
  }

  ngOnInit(): void {
    this.setVuln()
    this.backendCom.getVulnerabilitiesConfig().subscribe(data => {
      this.currentConfig = data;
    })
  }

  activateHelperPost() {

    this.backendCom.activateHelperPost().subscribe(data => {
      this.helperPostStatus = 1;
      this.btnColour = '#0cb405';
      this.currentConfig.hint_difficulty = 2;
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Helper Posts are now active! Reset DB to go back.",
      })
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
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      panelClass: ['snack-bar-background'],
      data: "Resetting database, please wait ...",
    })
    this.backendCom.resetDatabase().subscribe(value => {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Database has been reset. Logging out ...",
      })
      this.authAdmin.logoutAdmin();
      this.router.navigate(['/userLogin'])
    });
  }
}
