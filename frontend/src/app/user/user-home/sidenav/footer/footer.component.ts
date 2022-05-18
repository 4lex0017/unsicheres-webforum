import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DialogContactFormComponent} from "../../dialog/dialog-contact-form/dialog-contact-form.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private dialog: MatDialog,
              private router: Router) {
  }

  openContactform(): void {
    const dialogRef = this.dialog.open(DialogContactFormComponent, {
      width: '65%'
    });
  }

}
