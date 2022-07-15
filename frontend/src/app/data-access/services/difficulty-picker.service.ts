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

  updateConfig(): void {
    this.backendCom.getVulnerabilitiesConfig().subscribe(data => {
      DifficultyPickerService.curConfig = data
    });
  }


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
    content = content.replace("</script>", "");
    return content.replace("<script>", "");
  }

  frontendFilterTagsHard(content: string): string {
    if (content.includes("<script>") || content.includes("</script>")) {
      content = content.replace("</script>", "");
      return this.frontendFilterTagsHard(content.replace("<script>", ""));
    } else {
      return content;
    }

  }
}
