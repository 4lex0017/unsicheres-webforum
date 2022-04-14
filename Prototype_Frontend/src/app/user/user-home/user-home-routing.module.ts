import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {ForumComponent} from "./forum/forum.component";
import {ErrorComponent} from "../../shared/error/error.component";
import {UserHomeComponent} from "./user-home.component";

const routes: Routes = [
  { path: '',component: UserHomeComponent, children:[
      { path: 'home', component: ForumComponent},
      { path: '',   redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'general',
        loadChildren: () => import('../user-thread-view/user-thread-view.module').then(m => m.UserThreadViewModule)
      },
      {
        path: 'community',
        loadChildren: () => import('../user-thread-view/user-thread-view.module').then(m => m.UserThreadViewModule)
      },
      {
        path: 'support',
        loadChildren: () => import('../user-thread-view/user-thread-view.module').then(m => m.UserThreadViewModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../user-profile-view/user-profile-view.module').then(m => m.UserProfileViewModule)
      },
      {
        path: 'settings',
        loadChildren: () => import('../user-settings/user-settings.module').then(m => m.UserSettingsModule)
      },
      { path: '**', component: ErrorComponent },

    ] },


  { path: '**', component: ErrorComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserHomeRoutingModule { }
