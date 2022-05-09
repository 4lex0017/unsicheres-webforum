import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot} from '@angular/router';
import {SnackBarNotificationComponent} from "./shared/snack-bar-notification/snack-bar-notification.component";
import {BackendService} from "./data-access/services/backend.service";
import {MatSnackBar} from "@angular/material/snack-bar";

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {
  constructor(private backend: BackendService,
              private _snackBar: MatSnackBar) {
  }


  public canActivate(route: ActivatedRouteSnapshot) {
    let user = sessionStorage.getItem('upperUser');
    if (user == 'admin') {
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
