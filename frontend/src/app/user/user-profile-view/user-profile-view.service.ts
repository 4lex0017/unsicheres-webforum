import { Injectable } from '@angular/core';
import {BackendService} from "../../data-access/services/backend.service";
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {catchError, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserProfileViewService {

  constructor(
    private backendService: BackendService,
    private router: Router
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.backendService.getUser(route.params['id']).pipe(catchError((err) => this.router.navigateByUrl('/')));
  }
}
