import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import {ThemeService} from "../../theme.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent  {
  username;
  password;

  constructor(private http : HttpClient, private router : Router) {
  }


  handleLoginClick(){
    if(this.username && this.password){
      this.authenticateUser(this.username);
    } else {
      alert('enter username and password');
    }

  }

  openAdminLogin():void{
    this.router.navigate(['/adminlogin'])
  }


  authenticateUser(userName){
    sessionStorage.setItem("user", userName);
    if(userName == "admin"){
      this.router.navigate(['/admin']);
    } else {
      this.router.navigate(['/forum']);
    }
  }

}
