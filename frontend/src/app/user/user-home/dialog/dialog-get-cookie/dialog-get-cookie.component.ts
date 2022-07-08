import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";

@Component({
  selector: 'app-dialog-get-cookie',
  templateUrl: './dialog-get-cookie.component.html',
  styleUrls: ['./dialog-get-cookie.component.scss']
})
export class DialogGetCookieComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogGetCookieComponent>,
              private clipboard: Clipboard, private _snackBar: MatSnackBar,
  ) {
  }

  cookieValue: string;
  cookieName: string;

  ngOnInit(): void {
    this.cookieValue = "o[sfagjhera[phjeadfjhedjhphjrtspijrtpisojhrtsdfgphj"
    this.cookieName = "trackingCookieDummy"
  }

  copyToClipboard(copyText: string) {
    this.clipboard.copy(copyText);
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      data: "Copied to clipboard."
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
