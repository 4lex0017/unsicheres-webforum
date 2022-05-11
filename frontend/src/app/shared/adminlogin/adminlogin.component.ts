import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminLoginComponent {
  adminname: string;
  password: string;

  constructor(private http: HttpClient, private router: Router) {
  }

  handleLoginClick() {
    if (this.adminname && this.password) {
      this.authenticateAdmin();
    } else {
      alert('enter adminname and password');
    }
  }

  authenticateAdmin() {
    sessionStorage.setItem("upperUser", this.adminname);
    if (this.adminname == "admin") {
      this.router.navigate(['/admin']);
    }
  }

  openUserLogin() {
    this.router.navigate(['/login'])
  }
}
