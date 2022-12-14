import {NgModule} from '@angular/core';
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatSlideToggleModule} from "@angular/material/slide-toggle";
import {MatDialogModule} from "@angular/material/dialog";
import {MatButtonModule} from "@angular/material/button";
import {MatIconModule} from "@angular/material/icon";
import {MatSelectModule} from "@angular/material/select";
import {MatListModule} from "@angular/material/list";
import {MatCardModule} from "@angular/material/card";
import {MatTableModule} from "@angular/material/table";
import {MatSortModule} from "@angular/material/sort";
import {MatGridListModule} from '@angular/material/grid-list';
import {MatMenuModule} from '@angular/material/menu';
import {LayoutModule} from '@angular/cdk/layout';
import {MatPaginatorModule} from "@angular/material/paginator";
import {VulnerabilitiesComponent} from "./vulnerabilities/vulnerabilities.component";
import {SettingsComponent} from "./settings/settings.component";
import {ScoreboardComponent} from "./scoreboard/scoreboard.component";
import {SidenavComponent} from "./sidenav/sidenav.component";
import {RouterModule} from "@angular/router";
import {AdminRoutingModule} from "./admin-routing.module";
import {FormsModule} from "@angular/forms";
import {CommonModule} from "@angular/common";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatTabsModule} from "@angular/material/tabs";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {VulnerabilityPickerComponent} from './vulnerability-picker/vulnerability-picker.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {
  DialogShowCurrentConfigComponent
} from './dialog/dialog-show-current-config/dialog-show-current-config.component';
import {VulnerabilityPickerSwitchComponent} from './vulnerability-picker-switch/vulnerability-picker-switch.component';
import {MatRadioModule} from "@angular/material/radio";


@NgModule({
  declarations: [
    VulnerabilitiesComponent,
    SettingsComponent,
    ScoreboardComponent,
    SidenavComponent,
    VulnerabilityPickerComponent,
    DialogShowCurrentConfigComponent,
    VulnerabilityPickerSwitchComponent,

  ],
  imports: [
    MatSidenavModule,
    MatToolbarModule,
    MatSlideToggleModule,
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatSelectModule,
    MatListModule,
    MatCardModule,
    MatTableModule,
    MatSortModule,
    MatGridListModule,
    MatMenuModule,
    LayoutModule,
    MatPaginatorModule,
    RouterModule,
    AdminRoutingModule,
    FormsModule,
    CommonModule,
    MatTooltipModule,
    MatTabsModule,
    MatCheckboxModule,
    MatProgressSpinnerModule,
    MatRadioModule
  ],
  exports: []
})
export class AdminModule {
}
