import { Component, OnInit } from '@angular/core';
import {DialogCreateThreadComponent} from "../../dialog-create-thread/dialog-create-thread.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogLoginComponent} from "../dialog-login/dialog-login.component";
import {DialogRegisterComponent} from "../dialog-register/dialog-register.component";
import {Router} from "@angular/router";
import {ThemeService} from "../../../../theme.service";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private dialog: MatDialog,
              private router: Router,
              private themeService: ThemeService) {
    this.themeService.initTheme();
    this.darkMode = this.themeService.isDarkMode();
  }

  darkMode = true;

  ngOnInit(): void {
  }

  openLogin():void{
    const dialogRef = this.dialog.open(DialogLoginComponent, {
      width: '30%',
      data: {
        username: "",
        content: "",
      },
    });
  }

  openRegister():void{
    const dialogRef = this.dialog.open(DialogRegisterComponent, {
      width: '30%',
      data: {
        username: "",
        password: "",
        repeatPassword: "",
      },
    });
  }

  toggleDarkMode() {
    this.darkMode = this.themeService.isDarkMode();
    this.darkMode ? this.themeService.update('light-mode') : this.themeService.update('dark-mode');
  }

}
