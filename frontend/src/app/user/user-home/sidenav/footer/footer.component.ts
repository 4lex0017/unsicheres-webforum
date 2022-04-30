import {Component, OnInit} from '@angular/core';
import {DialogCreateThreadComponent} from "../../dialog-create-thread/dialog-create-thread.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogContactformComponent} from "../dialog-kontaktformular/dialog-contactform.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor( private dialog: MatDialog) {
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
