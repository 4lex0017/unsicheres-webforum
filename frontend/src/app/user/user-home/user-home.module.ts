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
import {DialogCreateThreadComponent} from './dialog-create-thread/dialog-create-thread.component';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";
import {MatTooltipModule} from "@angular/material/tooltip";
import {SearchComponent} from './search/search.component';
import {DialogSearchErrorMessageComponent} from './dialog-search-error-message/dialog-search-error-message.component';
import {SharedModule} from "../../shared/shared.module";
import {DialogContactformComponent} from "./sidenav/dialog-kontaktformular/dialog-contactform.component";
import {DialogLoginComponent} from "./sidenav/dialog-login/dialog-login.component";
import {DialogRegisterComponent} from "./sidenav/dialog-register/dialog-register.component";
import {UserSettingsComponent} from "../user-settings/user-settings.component";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatMenuModule} from "@angular/material/menu";


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
    DialogContactformComponent,
    DialogLoginComponent,
    DialogRegisterComponent,
    UserSettingsComponent,
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
        //Delete later
    ]
})
export class UserHomeModule {
}
