import { Component } from '@angular/core';
import { Router } from '@angular/router';
import {ThemeService} from "./theme.service";
import {SidenavComponent} from "./admin/sidenav/sidenav.component";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Prototype';


  constructor() {
  }

}
