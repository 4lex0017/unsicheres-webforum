import {Injectable} from '@angular/core';
import {VulnerabilitiesConfig} from "../models/vulnerabilitiesConfig";
import {BackendCommunicationService} from "./backend-communication.service";

@Injectable({
  providedIn: 'root'
})
export class DifficultyPickerService {
  static curConfig: VulnerabilitiesConfig;

  constructor(private backendCom: BackendCommunicationService) {
  }


  isEnabled(idVuln: number, idState: number): boolean {
    // let curVuln = this.getCurrentData(idVuln)
    // if (curVuln) {
    //   for (let state of curVuln.subtasks) {
    //     if (state.id == idState) {
    //       if (state.checked) return true;
    //       return false;
    //     }
    //   }
    // }
    return false;
  }

  updateConfig(): void {

    this.backendCom.getVulnerabilitiesConfig().subscribe(data => {
      DifficultyPickerService.curConfig = data
      console.log(DifficultyPickerService.curConfig)
    });


  }


  // change vEnabled to number with this mapping
  // 0 == false
  // 1 == true (backend)
  // 2 == frontend easy
  // 3 == frontend normal
  // 4 == frontend hard

  isEnabledInConfig(str: string): boolean {
    this.updateConfig()

    for (let i = 0; i < DifficultyPickerService.curConfig.data.length; i++) {
      if (DifficultyPickerService.curConfig.data[i].uri == str) {
        if (DifficultyPickerService.curConfig.data[i].rxss_difficulty != null) {
          if (DifficultyPickerService.curConfig.data[i].rxss_difficulty! < 4) return true;
        }
        if (DifficultyPickerService.curConfig.data[i].sxss_difficulty != null) {
          if (DifficultyPickerService.curConfig.data[i].sxss_difficulty! < 4) return true
        }
      }
    }
    return false;
  }


  frontendFilterTagsNormal(content: string): string {
    return content.replace("<script>", "");
  }

  frontendFilterTagsHard(content: string): string {
    if (content.includes("<script>")) {
      return this.frontendFilterTagsHard(content.replace("<script>", ""));
    } else {
      return content;
    }

  }
}
