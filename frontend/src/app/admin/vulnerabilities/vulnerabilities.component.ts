import {Component, OnInit} from '@angular/core';
import {ThemePalette} from "@angular/material/core";
import {VulnerabilityDifficultyOverview} from "../../data-access/models/vulnerabilityDifficultyOverview";


@Component({
  selector: 'app-vulnerabilities',
  templateUrl: './vulnerabilities.component.html',
  styleUrls: ['./vulnerabilities.component.scss']
})
export class VulnerabilitiesComponent {

  constructor() {
  }

  xssReflected: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };
  xssStored: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };

  updateAllComplete(task: VulnerabilityDifficultyOverview) {
    task.allCompleted = task.subtasks != null && task.subtasks.every(t => t.completed);
  }

  someComplete(task: VulnerabilityDifficultyOverview): boolean {
    if (task.subtasks == null) {
      return false;
    }
    return task.subtasks.filter(t => t.completed).length > 0 && !task.allCompleted;
  }

  setAll(completed: boolean, task: VulnerabilityDifficultyOverview) {
    task.allCompleted = completed;
    if (task.subtasks == null) {
      return;
    }
    task.subtasks.forEach(t => (t.completed = completed));
  }
}
