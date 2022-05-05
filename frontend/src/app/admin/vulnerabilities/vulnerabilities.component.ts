import {Component, OnInit} from '@angular/core';
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
    name: 'Insecure Password Handling',
    description: 'Passwords are not stored as salted hashes, older algorithms are used.',
    subtasks: [
      {state: 'Easy', description: 'Oldest algorithm.', checked: false},
      {state: 'Medium', description: 'Medium algorithm.', checked: false},
      {state: 'Hard', description: 'Hard algorithm.', checked: false},
    ],
  };
  brokenAuthentication: VulnerabilityDifficultyOverview = {
    name: 'Broken Authentication',
    description: 'Short/Blank passwords allowed. Brute force attacks are allowed. Easy login with User Enumeration possibility.',
    subtasks: [
      {state: 'Easy', description: 'User enumeration, very easy passwords.', checked: false},
      {state: 'Medium', description: 'User enumeration, medium passwords.', checked: false},
      {state: 'Hard', description: 'Hard passwords.', checked: false},
    ],
  };
  sqlInjection: VulnerabilityDifficultyOverview = {
    name: 'SQL Injection',
    description: 'Allows the User to execute SQL Queries. Difficulty changes filtering for SQL Queries.',
    subtasks: [
      {state: 'Easy', description: 'No filtering.', checked: false},
      {state: 'Medium', description: 'Easy filtering with String.matches().', checked: false,},
      {state: 'Hard', description: 'Hard filtering.', checked: false},
    ],
  };
  commandInjection: VulnerabilityDifficultyOverview = {
    name: 'Command Injection',
    description: 'Allows the User to execute commands on the host OS.',
    subtasks: [
      {state: 'Easy', description: 'No filtering.', checked: false},
      {state: 'Medium', description: 'Easy filtering with String.matches().', checked: false},
      {state: 'Hard', description: 'Hard filtering.', checked: false},
    ],
  };
  fileUpload: VulnerabilityDifficultyOverview = {
    name: 'File Upload',
    description: '',
    subtasks: [
      {state: 'Easy', description: 'Accept every Filetype.', checked: false},
      {state: 'Medium', description: 'Accept some Filetypes.', checked: false},
      {state: 'Hard', description: 'Accept selective Filetypes.', checked: false},
    ],
  };
  xssReflected: VulnerabilityDifficultyOverview = {
    name: 'XSS Reflected',
    description: 'Allows the User to execute <script> and other tags on the site / in queries. Difficulty changes filtering for SQL Queries.',
    subtasks: [
      {state: 'Easy', description: 'No filtering.', checked: false},
      {state: 'Medium', description: 'Easy filtering with String.matches().', checked: false},
      {state: 'Hard', description: 'Hard filtering.', checked: false},
    ],
  };
  xssStored: VulnerabilityDifficultyOverview = {
    name: 'XSS Stored',
    description: 'Allows the User to save <script> and other tags on the site. Difficulty changes filtering for SQL Queries.',
    subtasks: [
      {state: 'Easy', description: 'No filtering.', checked: false},
      {state: 'Medium', description: 'Easy filtering with String.matches().', checked: false},
      {state: 'Hard', description: 'Hard filtering.', checked: false},
    ],
  };
}
