import { Component, OnInit } from '@angular/core';
import {DialogCreateThreadComponent} from "../../dialog-create-thread/dialog-create-thread.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogLoginComponent} from "../dialog-login/dialog-login.component";
import {DialogRegisterComponent} from "../dialog-register/dialog-register.component";

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.scss']
})
export class ToolbarComponent implements OnInit {

  constructor(private dialog: MatDialog) { }

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

}
