import {Component, OnInit} from '@angular/core';
import {VulnerabilityDifficultyOverview} from "../../data-access/models/vulnerabilityDifficultyOverview";
import {BackendService} from "../../data-access/services/backend.service";
import {Router} from "@angular/router";


@Component({
  selector: 'app-vulnerabilities',
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent implements OnInit {
  vulnerabilities: VulnerabilityDifficultyOverview[];

  constructor(private backend: BackendService, private router: Router) {
  }

  ngOnInit(): void {
    this.vulnerabilities = this.backend.getVulnerabilities();
  }

  updateToDatabase(): void {
    console.log(this.vulnerabilities)
    this.backend.setVulnerabilities(this.vulnerabilities);
  }

  goToMain() {
    this.router.navigate(['/forum'])
  }

  updateVulnerability(data: VulnerabilityDifficultyOverview): void {
    for (let v of this.vulnerabilities) {
      if (v.id == data.id) {
        v = data;
        break;
      }
    }
  }
}
