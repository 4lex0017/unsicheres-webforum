import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, Observable, shareReplay, tap} from "rxjs";
import {constant} from "../static/url";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {

  constructor(private httpClient: HttpClient) {
  }

  readonly url: string = constant.url;

  getCurrentUsername(): string {
    return localStorage.getItem("currentUsername")!;
  }

  getCurrentUserId(): number {
    return parseInt(localStorage.getItem("currentUserId")!);
  }


  public loginJwt(name: string, password: string) {
    return this.httpClient.post<any>(this.url + '/login', {
      name,
      password
    }, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    }).pipe(tap(res => this.setSession(res['body'], name),
      error => {
      }), shareReplay());
  }

  private setSession(authResult, username) {
    localStorage.setItem("currentUsername", username)
    localStorage.setItem("currentUserId", authResult.user_id)
    localStorage.setItem("bearerToken", authResult.access_token)

  }

  public registerJwt(name: string, password: string, birthDate: string, profilePicture: string) {
    let userPayload;
    if (profilePicture != "") {
      userPayload = {
        name,
        password,
        birthDate,
        profilePicture
      }
    } else {
      userPayload = {
        name,
        password,
        birthDate
      }
    }
    return this.httpClient.post<any>(this.url + '/register', userPayload, {
      headers: new HttpHeaders({'Content-Type': 'application/json'}),
      observe: 'response'
    })
      .pipe(tap(res => this.setSession(res['body'], name)), shareReplay(), catchError((error: Response) => {
        throw {message: 'Bad response', value: error.status}
      }));
  }

  public logout() {
    this.logoutUserBackend().subscribe(
      value => {
        localStorage.removeItem("currentUsername")
        localStorage.removeItem("currentUserId")
        localStorage.removeItem("bearerToken")
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
