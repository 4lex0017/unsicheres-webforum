import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {ErrorComponent} from "./error/error.component";
import {FormsModule} from "@angular/forms";
import {DidAThingComponent} from './did-a-thing/did-a-thing.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AdminLoginComponent} from "./adminlogin/adminlogin.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";


@NgModule({
  declarations: [
    LoginComponent,
    ErrorComponent,
    DidAThingComponent,
    AdminLoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule
  ],
  exports: [
    LoginComponent,
    ErrorComponent,
    DidAThingComponent
  ]
})
export class SharedModule {
}
