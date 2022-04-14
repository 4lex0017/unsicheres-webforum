import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserThreadViewRoutingModule } from './user-thread-view-routing.module';
import { DialogEditThreadComponent } from './dialog-edit-thread/dialog-edit-thread.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import { DialogCreatePostComponent } from './dialog-create-post/dialog-create-post.component';
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import { DialogEditPostComponent } from './dialog-edit-post/dialog-edit-post.component';


@NgModule({
  declarations: [
    DialogEditThreadComponent,
    DialogCreatePostComponent,
    DialogEditPostComponent
  ],
  imports: [
    CommonModule,
    UserThreadViewRoutingModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    MatDialogModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatRadioModule
  ]
})
export class UserThreadViewModule { }
