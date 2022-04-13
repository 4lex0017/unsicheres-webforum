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


@NgModule({
  declarations: [
    CategoryComponent,
    ForumComponent,
    FooterComponent,
    ToolbarComponent,
    UserHomeComponent
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
    UserThreadViewModule  //Delete later
  ]
})
export class UserHomeModule { }
