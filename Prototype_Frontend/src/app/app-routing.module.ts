import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {LoginComponent} from "./shared/login/login.component";
import {RouteGuardService} from "./route-guard.service";
import {ErrorComponent} from "./shared/error/error.component";

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  // { path: 'adminlogin', component: AdminLoginComponent },
  {
    path: 'admin',
    canActivate : [RouteGuardService],
    loadChildren: () => import('./admin/admin.module').then(m => m.AdminModule)
  },
  {
  path: 'forum',
  loadChildren: () => import('./user/user-home/user-home.module').then(m => m.UserHomeModule)
  },
  { path: '', redirectTo : 'login', pathMatch:'full' },
  { path: '**', component: ErrorComponent }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)
  ],
  exports:[RouterModule]
})
export class AppRoutingModule { }
