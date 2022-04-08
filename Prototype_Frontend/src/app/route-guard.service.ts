import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class RouteGuardService implements CanActivate {

  constructor() { }


  public canActivate(route: ActivatedRouteSnapshot){
      let user = sessionStorage.getItem('user');
      if(user == 'admin'){
        return true;
      }
    window.alert("You don't have permission to view this page");
    return false;
    }
}
