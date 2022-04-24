import { Injectable } from '@angular/core';
import {ActivatedRoute, ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {BackendService} from "../../data-access/services/backend.service";
import {catchError, Observable} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class UserThreadViewService {

  constructor(
    private backendService: BackendService,
    private router: Router
  ) { }
  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    return this.backendService.getThread(route.params['slug']).pipe( catchError((err) => this.router.navigateByUrl('/')));
  }
}
