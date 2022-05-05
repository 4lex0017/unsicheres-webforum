import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {UserSettingsComponent} from "./user-settings.component";
import {UserProfileViewService} from "../user-profile-view/user-profile-view.service";


const routes: Routes = [
  {
    path: ':settings',
    component: UserSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserSettingsRoutingModule { }
