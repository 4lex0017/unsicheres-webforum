import {Component, OnInit} from '@angular/core';
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarNotificationComponent} from "../snack-bar-notification/snack-bar-notification.component";
import {Router} from "@angular/router";

@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.scss']
})
export class ErrorComponent implements OnInit {

  constructor(private _snackBar: MatSnackBar, private router: Router) {
  }

  ngOnInit(): void {
    let snackBarRef = this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "You will be redirected shortly."
      },
    );
    snackBarRef.afterDismissed().subscribe(value => this.router.navigate(['/forum']))
  }
}
