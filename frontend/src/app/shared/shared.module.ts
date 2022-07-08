import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {LoginComponent} from "./login/login.component";
import {ErrorComponent} from "./error/error.component";
import {FormsModule} from "@angular/forms";
import {DidAThingComponent} from './did-a-thing/did-a-thing.component';
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {AdminLoginComponent} from "./adminlogin/adminlogin.component";
import {SnackBarNotificationComponent} from './snack-bar-notification/snack-bar-notification.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {DialogFirstLoginComponent} from './dialog-first-login/dialog-first-login.component';
import {MatDialogModule} from "@angular/material/dialog";
import {MatDividerModule} from "@angular/material/divider";


@NgModule({
  declarations: [
    LoginComponent,
    ErrorComponent,
    DidAThingComponent,
    AdminLoginComponent,
    SnackBarNotificationComponent,
    DialogFirstLoginComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    MatIconModule,
    MatButtonModule,
    MatProgressBarModule,
    MatDialogModule,
    MatDividerModule
  ],
  exports: [
    LoginComponent,
    ErrorComponent,
    DidAThingComponent,
    SnackBarNotificationComponent
  ]
})
export class SharedModule {
}
