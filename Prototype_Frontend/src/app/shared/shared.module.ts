import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {ErrorComponent} from "./error/error.component";
import {FormsModule} from "@angular/forms";



@NgModule({
  declarations: [
    LoginComponent,
    ErrorComponent
  ],
  imports: [
    CommonModule,
    FormsModule
  ],
  exports:[
    LoginComponent,
    ErrorComponent
  ]
})
export class SharedModule { }
