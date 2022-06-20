import {NgModule} from '@angular/core';
import {AppComponent} from './app.component';
import {BrowserModule} from "@angular/platform-browser";
import {FormsModule} from "@angular/forms";
import {HTTP_INTERCEPTORS, HttpClientModule} from "@angular/common/http";
import {AppRoutingModule} from "./app-routing.module";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {SharedModule} from "./shared/shared.module";
import {UserThreadViewComponent} from './user/user-thread-view/user-thread-view.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {UserProfileViewComponent} from './user/user-profile-view/user-profile-view.component';
import {MatTabsModule} from "@angular/material/tabs";
import {MatBadgeModule} from "@angular/material/badge";
import {MatChipsModule} from "@angular/material/chips";
import {MatListModule} from "@angular/material/list";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {UserThreadViewModule} from "./user/user-thread-view/user-thread-view.module";
import {DatePipe} from "@angular/common";

@NgModule({
  declarations: [
    AppComponent,
    UserThreadViewComponent,
    UserProfileViewComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    MatCardModule,
    MatIconModule,
    MatButtonModule,
    MatTabsModule,
    MatBadgeModule,
    MatChipsModule,
    MatListModule,
    MatTooltipModule,
    MatSnackBarModule,
    UserThreadViewModule,

  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
}
