import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';

@Component({
  selector: 'app-adminlogin',
  templateUrl: './adminlogin.component.html',
  styleUrls: ['./adminlogin.component.scss']
})
export class AdminLoginComponent {
  adminname;
  password;
  ipAdress;

  constructor(private http: HttpClient, private router: Router) {
  }

  handleLoginClick() {
    if (this.adminname && this.password) {
      this.authenticateAdmin(this.adminname);
    } else {
      alert('enter adminname and password');
    }
  }

  authenticateAdmin(adminName) {
    sessionStorage.setItem("user", adminName);
    if (adminName == "admin") {
      this.router.navigate(['/admin']);
    }
  }

  openUserLogin() {
    this.router.navigate(['/login'])
  }
}
