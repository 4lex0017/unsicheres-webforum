import {Component} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {DialogContactFormComponent} from "../../dialog/dialog-contact-form/dialog-contact-form.component";
import {DialogGetCookieComponent} from "../../dialog/dialog-get-cookie/dialog-get-cookie.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private dialog: MatDialog) {
  }

  openContactform(): void {
    this.dialog.open(DialogContactFormComponent, {
      width: '65%'
    });
  }

  getCookieDialog() {
    this.dialog.open(DialogGetCookieComponent, {
      width: '25%'
    });
  }

}
