import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DialogContactFormComponent} from "../../dialog/dialog-contact-form/dialog-contact-form.component";
import {AuthenticationService} from "../../../../data-access/services/authentication.service";
import {DialogGetCookieComponent} from "../../dialog/dialog-get-cookie/dialog-get-cookie.component";

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private dialog: MatDialog,
              private router: Router,
              private auth: AuthenticationService) {
  }

  openContactform(): void {
    const dialogRef = this.dialog.open(DialogContactFormComponent, {
      width: '65%'
    });
  }

  testlogin() {
    this.auth.loginJwt("TestUsername1", "123").subscribe()
  }

  getCookieDialog() {
    const dialogRef = this.dialog.open(DialogGetCookieComponent, {
      width: '65%'
    });
  }

}
