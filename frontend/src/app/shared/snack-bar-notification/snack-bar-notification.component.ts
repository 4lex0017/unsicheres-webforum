import {Component, Inject, OnInit} from '@angular/core';
import {MAT_SNACK_BAR_DATA, MatSnackBarRef} from "@angular/material/snack-bar";
import {interval} from "rxjs";

@Component({
  selector: 'app-snack-bar-notification',
  templateUrl: './snack-bar-notification.component.html',
  styleUrls: ['./snack-bar-notification.component.scss']
})
export class SnackBarNotificationComponent implements OnInit {

  progressbarValue = 100;
  curSec: number = 0;
  sub: any;

  constructor(@Inject(MAT_SNACK_BAR_DATA) public data: String,
              private _snackRef: MatSnackBarRef<SnackBarNotificationComponent>,) {
  }

  ngOnInit(): void {
    const time = 45;
    const timer$ = interval(100);
    this.sub = timer$.subscribe((sec) => {
      this.progressbarValue = 100 - sec * 100 / time;
      this.curSec = sec;
      if (this.curSec === time) {
        this.sub.unsubscribe();
      }
    });
  }

  dismiss() {
    this.sub.unsubscribe();
    this._snackRef.dismiss();
  }
}
