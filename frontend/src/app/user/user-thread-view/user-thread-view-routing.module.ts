import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {UserThreadViewComponent} from "./user-thread-view.component";
import {UserThreadViewService} from "./user-thread-view.service";


const routes: Routes = [
  {
    path: ':id',
    component: UserThreadViewComponent,
    resolve: {
      thread: UserThreadViewService
    }
  },
  {path: 'users/*', redirectTo: '/forum/users', pathMatch: 'full'},
  {path: '**', redirectTo: '/forum/home', pathMatch: 'full'},

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserThreadViewRoutingModule {
}
