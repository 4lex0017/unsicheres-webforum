import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {FooterComponent} from "./sidenav/footer/footer.component";
import {ToolbarComponent} from "./sidenav/toolbar/toolbar.component";
import {UserHomeRoutingModule} from './user-home-routing.module';
import {CategoryComponent} from './category/category.component';
import {ForumComponent} from './forum/forum.component';
import {UserHomeComponent} from './user-home.component';
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {UserThreadViewModule} from "../user-thread-view/user-thread-view.module";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatNativeDateModule, MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SearchComponent} from './search/search.component';
import {SharedModule} from "../../shared/shared.module";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatMenuModule} from "@angular/material/menu";
import {
  DialogContactFormDismissComponent
} from './dialog/dialog-contact-form-dismiss/dialog-contact-form-dismiss.component';
import {
  DialogSearchErrorMessageComponent
} from "./dialog/dialog-search-error-message/dialog-search-error-message.component";
import {DialogCreateThreadComponent} from "./dialog/dialog-create-thread/dialog-create-thread.component";
import {DialogLoginComponent} from "./dialog/dialog-login/dialog-login.component";
import {DialogRegisterComponent} from "./dialog/dialog-register/dialog-register.component";
import {DialogContactFormComponent} from './dialog/dialog-contact-form/dialog-contact-form.component';
import {MatProgressBarModule} from "@angular/material/progress-bar";
import {MatDatepickerModule} from "@angular/material/datepicker";


@NgModule({
  declarations: [
    CategoryComponent,
    ForumComponent,
    FooterComponent,
    ToolbarComponent,
    UserHomeComponent,
    DialogCreateThreadComponent,
    SearchComponent,
    DialogSearchErrorMessageComponent,
    DialogContactFormComponent,
    DialogLoginComponent,
    DialogRegisterComponent,
    DialogContactFormDismissComponent,
    DialogContactFormComponent,
  ],
  imports: [
    CommonModule,
    MatToolbarModule,
    MatIconModule,
    MatListModule,
    MatSidenavModule,
    MatButtonModule,
    UserHomeRoutingModule,
    RouterModule,
    MatTableModule,
    MatPaginatorModule,
    UserThreadViewModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatDialogModule,
    MatOptionModule,
    MatSelectModule,
    MatTooltipModule,
    SharedModule,
    MatSlideToggleModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatProgressBarModule,
    MatDatepickerModule,
    MatNativeDateModule

  ]
})
export class UserHomeModule {
}
