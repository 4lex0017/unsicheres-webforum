import {Component, OnInit} from '@angular/core';
import {MatDialog, MatDialogRef} from "@angular/material/dialog";
import {Router} from "@angular/router";
import {DialogFirstLoginComponent} from "../dialog-first-login/dialog-first-login.component";

@Component({
  selector: 'app-dialog-has-cookie',
  templateUrl: './dialog-has-cookie.component.html',
  styleUrls: ['./dialog-has-cookie.component.scss']
})
export class DialogHasCookieComponent {

  constructor(private dialogRef: MatDialogRef<DialogHasCookieComponent>,
              private dialog: MatDialog,
              private router: Router) {
  }


  goToForum() {
    this.router.navigate(['/forum'])
    this.dialogRef.close();
  }

  showFirstLoginMessage() {
    this.dialogRef.close();
    this.dialog.open(DialogFirstLoginComponent, {
      width: '60%',
    });
    this.router.navigate(['/forum'])
  }

  close() {
    this.dialogRef.close();
  }
}
