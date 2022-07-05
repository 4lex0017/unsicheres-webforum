import {Injectable} from '@angular/core';
import {BackendService} from "./backend.service";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {Observable, shareReplay, tap} from "rxjs";
import {constant} from "../static/url";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private backend: BackendService, private httpClient: HttpClient) {
  }

  readonly url: string = constant.url;

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
    return this.httpClient.post<any>(this.url + '/login', {
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
    return this.httpClient.post<any>(this.url + '/register', {
      name,
      password,
      birthDate
    }, {headers: new HttpHeaders({'Content-Type': 'application/json'})}).pipe(tap(res => this.setSession(res, name)), shareReplay());
  }

  public logout() {
    this.logoutUserBackend().subscribe(
      value => {
        localStorage.removeItem("currentUsername")
        localStorage.removeItem("currentUserId")
        localStorage.removeItem("bearerToken")
        //  Catch this in backend (Peters job)
      }, error => {
        localStorage.removeItem("currentUsername")
        localStorage.removeItem("currentUserId")
        localStorage.removeItem("bearerToken")
      }
    );
  }

  private logoutUserBackend(): Observable<any> {
    return this.httpClient.post<any>(this.url + "/logout", {}, {headers: new HttpHeaders({'Content-Type': 'application/json'})});
  }

  isLoggedOut() {
    return localStorage.getItem("bearerToken") == null || localStorage.getItem("bearerToken") == "";
  }

  isLoggedIn() {
    return !this.isLoggedOut();
  }
}
