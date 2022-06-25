import {Injectable} from '@angular/core';
import {BackendService} from "./backend.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationServiceAdmin {

  constructor(private backend: BackendService, private httpClient: HttpClient) {
  }


  public loginJwtAdmin(name: string, password: string) {
    return this.httpClient.post<any>('http://localhost:80/admin/login', {
      name,
      password
    }, {headers: new HttpHeaders({'Content-Type': 'application/json'})}).pipe(tap(res => this.setSession(res), error => console.log(error)), shareReplay());
  }

  private setSession(authResult) {
    localStorage.setItem("bearerTokenAdmin", authResult.access_token)

  }


  public logoutAdmin() {
    localStorage.removeItem("bearerTokenAdmin")
  }

  isLoggedOut() {
    return localStorage.getItem("bearerTokenAdmin") == null || localStorage.getItem("bearerTokenAdmin") == "";
  }

  isLoggedIn() {
    return !this.isLoggedOut();
  }
}
