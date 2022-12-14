import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {ScoreboardComponent} from "./scoreboard/scoreboard.component";
import {ErrorComponent} from "../shared/error/error.component";
import {SettingsComponent} from "./settings/settings.component";
import {VulnerabilitiesComponent} from "./vulnerabilities/vulnerabilities.component";
import {SidenavComponent} from "./sidenav/sidenav.component";


const routes: Routes = [
  {
    path: '', component: SidenavComponent, children: [
      {path: '', redirectTo: 'vulnerabilities', pathMatch: 'full'},
      {path: 'scoreboard', component: ScoreboardComponent},
      {path: 'settings', component: SettingsComponent},
      {path: 'vulnerabilities', component: VulnerabilitiesComponent},
      {path: '**', component: ErrorComponent}
    ]
  },
  {path: '**', component: ErrorComponent}

];

@NgModule({
  declarations: [],
  imports: [RouterModule.forChild(routes)
  ],
  exports: [RouterModule]
})
export class AdminRoutingModule {
}
