import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, Router, RouterStateSnapshot} from "@angular/router";
import {BackendService} from "../../data-access/services/backend.service";
import {catchError, Observable} from "rxjs";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";

@Injectable({
  providedIn: 'root'
})
export class UserThreadViewService {

  constructor(
    private backendService: BackendService,
    private backendServiceCom: BackendCommunicationService,
    private router: Router
  ) {
  }

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<any> {
    // return this.backendService.getThread(route.params['slug']).pipe( catchError((err) => this.router.navigateByUrl('/')));
    return this.backendServiceCom.getThread(route.params['id']).pipe(catchError((err) => this.router.navigateByUrl('/forum')));
  }
}
