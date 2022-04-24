import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserProfileViewComponent} from "./user-profile-view.component";
import {UserProfileViewService} from "./user-profile-view.service";

const routes: Routes = [
  {
    path: ':id',
    component: UserProfileViewComponent,
    resolve: {
      user: UserProfileViewService
    }
  },
  { path: '**',   redirectTo: '/forum/home', pathMatch: 'full' },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserProfileViewRoutingModule { }
