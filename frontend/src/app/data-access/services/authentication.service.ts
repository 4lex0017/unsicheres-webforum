import {Injectable} from '@angular/core';
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUser: any;

  constructor(private backend: BackendService) {
  }

  public login(username: string, password: string) {
    if (this.backend.checkLoginData(username, password) == 1) {
      this.currentUser = this.backend.getLoginId(username, password);
    }
  }

  public logout() {
    this.currentUser = null;
  }
}
