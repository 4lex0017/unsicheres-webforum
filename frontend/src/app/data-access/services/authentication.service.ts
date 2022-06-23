import {Injectable} from '@angular/core';
import {BackendService} from "./backend.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {shareReplay, tap} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private backend: BackendService, private httpClient: HttpClient) {
  }

  getCurrentUsername(): string {
    return localStorage.getItem("currentUsername")!;
  }

  getCurrentUserId(): number {
    return parseInt(localStorage.getItem("currentUserId")!);
  }

  // public login(username: string, password: string) {
  //   if (this.backend.checkLoginData(username, password) == 1) {
  //     // this.currentUserId = this.backend.getLoginId(username, password);
  //   } else {
  //     console.log("not in file")
  //   }
  // }

  public loginJwt(name: string, password: string) {
    return this.httpClient.post<any>('http://localhost:80/login', {
      name,
      password
    }, {headers: new HttpHeaders({'Content-Type': 'application/json'})}).pipe(tap(res => this.setSession(res, name), error => console.log(error)), shareReplay());
  }

  private setSession(authResult, username) {
    localStorage.setItem("currentUsername", username)
    localStorage.setItem("currentUserId", authResult.user_id)
    localStorage.setItem("bearerToken", authResult.access_token)

  }

  public registerJwt(name: string, password: string, birthDate: string) {
    return this.httpClient.post<any>('http://localhost:80/register', {
      name,
      password
      // ,birthDate
    }, {headers: new HttpHeaders({'Content-Type': 'application/json'})}).pipe(tap(res => this.setSession(res, name)), shareReplay());
  }

  public logout() {
    localStorage.removeItem("currentUsername")
    localStorage.removeItem("currentUserId")
    localStorage.removeItem("bearerToken")
  }

  isLoggedOut() {
    return localStorage.getItem("bearerToken") == null || localStorage.getItem("bearerToken") == "";
  }

  isLoggedIn() {
    return !this.isLoggedOut();
  }
}
