import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserProfileViewRoutingModule } from './user-profile-view-routing.module';
import {DialogEditProfileComponent} from "./dialog-edit-profile/dialog-edit-profile.component";
import {MatDialogModule} from "@angular/material/dialog";
import {FormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatButtonModule} from "@angular/material/button";




@NgModule({
  declarations: [
    DialogEditProfileComponent
  ],
  imports: [
    CommonModule,
    UserProfileViewRoutingModule,
    MatDialogModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule
  ]
})
export class UserProfileViewModule { }
