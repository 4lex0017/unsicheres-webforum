import {Component, OnInit} from '@angular/core';
import {
  VulnerabilityDifficultyOverview,
  VulnerabilityDifficultyOverviewPackage
} from "../../data-access/models/vulnerabilityDifficultyOverview";
import {BackendService} from "../../data-access/services/backend.service";
import {Router} from "@angular/router";
import {Observable} from "rxjs";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {DialogLoginComponent} from "../../user/user-home/dialog/dialog-login/dialog-login.component";
import {MatDialog} from "@angular/material/dialog";
import {
  DialogShowCurrentConfigComponent
} from "../dialog/dialog-show-current-config/dialog-show-current-config.component";

import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {VulnerabilitiesConfig} from "../../data-access/models/vulnerabilitiesConfig";


@Component({
  selector: 'app-vulnerabilities',
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent implements OnInit {
  vulnerabilities$: Observable<VulnerabilityDifficultyOverviewPackage>;
  currentConfig: VulnerabilitiesConfig;
  curVulnerabilities: VulnerabilityDifficultyOverviewPackage = {vulnerabilities: []};

  constructor(private dialog: MatDialog, private backend: BackendService, private router: Router, private backendCom: BackendCommunicationService, private diffPicker: DifficultyPickerService) {
  }


  async setVuln() {
    this.backendCom.getVulnerabilities().subscribe((data) => this.curVulnerabilities = data);
  }

  ngOnInit(): void {
    this.setVuln()
    this.backendCom.getVulnerabilities().subscribe((data) => this.curVulnerabilities = data);
    // this.vulnerabilities$ = this.backendCom.getVulnerabilities();
    // this.backendCom.getVulnerabilities().subscribe(data => this.curVulnerabilities = data)
    this.backendCom.getVulnerabilitiesConfig().subscribe(data => {
      this.currentConfig = data;
    })
  }

  updateToDatabase(): void {
    console.log("in update")
    console.log(this.curVulnerabilities)
    this.backendCom.putVulnerabilitiesConfig(this.curVulnerabilities).subscribe(resp => {
      console.log(resp)
      this.currentConfig = resp;
    })
  }

  goToMain() {
    this.router.navigate(['/forum'])
  }

  showCurrentConfig() {
    const dialogRef = this.dialog.open(DialogShowCurrentConfigComponent, {
      width: '70%',
      data: this.currentConfig
    });
  }

  updateVulnerability(data: VulnerabilityDifficultyOverview): void {

    for (let v of this.curVulnerabilities.vulnerabilities) {
      if (v.id == data.id) {
        console.log(data)
        console.log(v)
        v = data;
        console.log(v)
        break;
      }
    }
  }

  resetDatabase() {
    this.backendCom.resetDatabase().subscribe();
  }
}
