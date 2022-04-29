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

  insecurePasswordHandling: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    description: 'Passwords are not stored as salted hashes, older algorithms are used.',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };
  brokenAuthentication: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    description: 'Short/Blank passwords allowed. Brute force attacks are allowed. Easy login with User Enumeration possibility.',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };
  sqlInjection: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    description: 'Allows the User to execute SQL Queries. Difficulty changes filtering for SQL Queries.',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };
  commandInjection: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    description: 'Allows the User to execute commands on the host OS.',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };
  fileUpload: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    description: '',
    subtasks: [
      {name: 'Easy', completed: false, color: 'primary'},
      {name: 'Medium', completed: false, color: 'primary'},
      {name: 'Hard', completed: false, color: 'primary'},
    ],
  };
  xssReflected: VulnerabilityDifficultyOverview = {
    name: 'All',
    allCompleted: false,
    completed: false,
    color: 'primary',
    description: 'Allows the User to execute <script> and other tags on the site / in queries. Difficulty changes filtering for SQL Queries.',
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
    description: 'Allows the User to save <script> and other tags on the site. Difficulty changes filtering for SQL Queries.',
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
