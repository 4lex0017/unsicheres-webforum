import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ForumComponent} from "./forum/forum.component";
import {ErrorComponent} from "../../shared/error/error.component";
import {UserHomeComponent} from "./user-home.component";
import {SearchComponent} from "./search/search.component";
import {UserSettingsComponent} from "../user-settings/user-settings.component";


const routes: Routes = [
  {
    path: '', component: UserHomeComponent, children: [
      {path: 'home', component: ForumComponent},
      {path: 'search', component: SearchComponent},
      {path: '', redirectTo: 'home', pathMatch: 'full'},
      {
        path: 'thread',
        loadChildren: () => import('../user-thread-view/user-thread-view.module').then(m => m.UserThreadViewModule)
      },
      {
        path: 'users',
        loadChildren: () => import('../user-profile-view/user-profile-view.module').then(m => m.UserProfileViewModule)
      },
      {
        path: 'settings', component: UserSettingsComponent
        //loadChildren: () => import('../user-settings/user-settings.module').then(m => m.UserSettingsModule)
      },
      {path: '**', component: ErrorComponent},

    ]
  },


  {path: '**', component: ErrorComponent}
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserHomeRoutingModule {
}
