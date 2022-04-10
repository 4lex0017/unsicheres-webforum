import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ForumComponent} from "./forum/forum.component";
import {ErrorComponent} from "../../shared/error/error.component";
import {UserHomeComponent} from "./user-home.component";

const routes: Routes = [
  { path: '',component: UserHomeComponent, children:[
      { path: 'home', component: ForumComponent },
      { path: '',   redirectTo: 'home', pathMatch: 'full' },
      { path: '**', component: ErrorComponent }

    ] },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserHomeRoutingModule { }
