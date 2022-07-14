import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, shareReplay, tap} from "rxjs";
import {constant} from "../static/url";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceAdmin {

  constructor(private httpClient: HttpClient) {
  }

  readonly url: string = constant.url;

  public loginJwtAdmin(name: string, password: string) {
    return this.httpClient.post<any>(this.url + '/admin/login', {
      name,
      password
    }, {headers: new HttpHeaders({'Content-Type': 'application/json'})}).pipe(tap(res => this.setSession(res), error => {
    }), shareReplay());
  }

  private setSession(authResult) {
    localStorage.setItem("bearerTokenAdmin", authResult.access_token)

  }


  public logoutAdmin() {

    this.logoutAdminBackend().subscribe(value => {
      localStorage.removeItem("bearerTokenAdmin")
    });
  }

  private logoutAdminBackend(): Observable<any> {
    return this.httpClient.post<any>(this.url + "/admin/logout", {}, {
      headers: new HttpHeaders({'Content-Type': 'application/json', "admin": "true"})
    });
  }

  isLoggedOut() {
    return localStorage.getItem("bearerTokenAdmin") == null || localStorage.getItem("bearerTokenAdmin") == "";
  }

  isLoggedIn() {
    return !this.isLoggedOut();
  }
}
