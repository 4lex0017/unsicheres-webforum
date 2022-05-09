import {Injectable} from '@angular/core';
import {BackendService} from "./backend.service";

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  public currentUserId: any;

  constructor(private backend: BackendService) {
  }

  public login(username: string, password: string) {
    if (this.backend.checkLoginData(username, password) == 1) {
      this.currentUserId = this.backend.getLoginId(username, password);
    } else {
      console.log("not in file")
    }
  }

  public logout() {
    this.currentUserId = null;
  }
}
