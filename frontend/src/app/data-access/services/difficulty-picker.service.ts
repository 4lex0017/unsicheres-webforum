import {Injectable, OnInit} from '@angular/core';
import {BackendService} from "./backend.service";
import {Observable} from "rxjs";
import {VulnerabilityDifficultyOverview} from "../models/vulnerabilityDifficultyOverview";

@Injectable({
  providedIn: 'root'
})
export class DifficultyPickerService {

  constructor(private backend: BackendService) {
  }


  getCurrentData(id: number): any {
    return this.backend.getVulnerability(id);
  }

  isEnabled(idVuln: number, idState: number): boolean {
    let curVuln = this.getCurrentData(idVuln)
    if (curVuln) {
      for (let state of curVuln.subtasks) {
        if (state.id == idState) {
          if (state.checked) return true;
          return false;
        }
      }
    }
    return false;
  }

  filterTagsEasy(content: string): string {
    return content.replace("<script>", "");
  }

  filterTagsHard(content: string): string {
    if (content.includes("<script>")) {
      return this.filterTagsHard(content.replace("<script>", ""));
    } else {
      return content;
    }

  }
}
