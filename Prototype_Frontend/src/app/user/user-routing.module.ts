import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import {ForumComponent} from "./forum/forum.component";
import {ErrorComponent} from "../shared/error/error.component";

const routes: Routes = [
  {path: '',component: ForumComponent},
  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserRoutingModule { }
