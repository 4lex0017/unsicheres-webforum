import {Component, OnInit} from '@angular/core';
import {DialogCreateThreadComponent} from "../../dialog-create-thread/dialog-create-thread.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogContactformComponent} from "../dialog-kontaktformular/dialog-contactform.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor( private dialog: MatDialog,
               private router: Router) {
  }

  openContactform(): void{
    const dialogRef = this.dialog.open(DialogContactformComponent, {
      width: '65%',
      data: {
        username: "",
        topic:"",
        message: "",
      },
    });
  }

}
