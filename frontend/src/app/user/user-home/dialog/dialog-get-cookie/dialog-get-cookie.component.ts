import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from "@angular/material/dialog";
import {Clipboard} from '@angular/cdk/clipboard';
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  SnackBarNotificationComponent
} from "../../../../shared/snack-bar-notification/snack-bar-notification.component";
import {CookieService} from "ngx-cookie-service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-dialog-get-cookie',
  templateUrl: './dialog-get-cookie.component.html',
  styleUrls: ['./dialog-get-cookie.component.scss']
})
export class DialogGetCookieComponent implements OnInit {

  constructor(private dialogRef: MatDialogRef<DialogGetCookieComponent>,
              private clipboard: Clipboard, private _snackBar: MatSnackBar,
              private router: Router,
              private cookieService: CookieService
  ) {
  }

  cookieValue: string;
  cookieName: string = "tracker";

  ngOnInit(): void {
    if (!this.cookieService.check('tracker')) {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "How did you get here? Login first."
      });
      this.router.navigate(['/userLogin']);
      this.dialogRef.close();
    }
    this.cookieValue = this.cookieService.get("tracker");
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
