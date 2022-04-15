import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatButtonModule} from "@angular/material/button";
import {FooterComponent} from "./sidenav/footer/footer.component";
import {ToolbarComponent} from "./sidenav/toolbar/toolbar.component";
import { UserHomeRoutingModule } from './user-home-routing.module';
import { CategoryComponent } from './category/category.component';
import { ForumComponent } from './forum/forum.component';
import { UserHomeComponent } from './user-home.component';
import {RouterModule} from "@angular/router";
import {MatTableModule} from "@angular/material/table";
import {MatPaginatorModule} from "@angular/material/paginator";
import {UserThreadViewModule} from "../user-thread-view/user-thread-view.module";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import { DialogCreateThreadComponent } from './dialog-create-thread/dialog-create-thread.component';
import {FormsModule} from "@angular/forms";
import {MatDialogModule} from "@angular/material/dialog";
import {MatOptionModule} from "@angular/material/core";
import {MatSelectModule} from "@angular/material/select";



@NgModule({
  declarations: [
    CategoryComponent,
    ForumComponent,
    FooterComponent,
    ToolbarComponent,
    UserHomeComponent,
    DialogCreateThreadComponent,
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
    //Delete later
  ]
})
export class UserHomeModule { }
