import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {SnackBarNotificationComponent} from "./shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  constructor(private _snackBar: MatSnackBar) {
  }


  public canActivate(route: ActivatedRouteSnapshot) {
    if (localStorage.getItem('bearerTokenAdmin')) {
      return true;
    } else {
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        data: "You don't have permission to view this page."
      });
      return false;
    }

  }
}
