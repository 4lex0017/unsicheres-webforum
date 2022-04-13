import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserThreadViewRoutingModule } from './user-thread-view-routing.module';
import { DialogEditThreadComponent } from './dialog-edit-thread/dialog-edit-thread.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";


@NgModule({
  declarations: [
    DialogEditThreadComponent
  ],
  imports: [
    CommonModule,
    UserThreadViewRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule
  ]
})
export class UserThreadViewModule { }
