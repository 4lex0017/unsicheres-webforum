import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {UserThreadViewRoutingModule} from './user-thread-view-routing.module';
import {DialogEditThreadComponent} from './dialog-edit-thread/dialog-edit-thread.component';
import {MatFormFieldModule} from "@angular/material/form-field";
import {FormsModule} from "@angular/forms";
import {MatButtonModule} from "@angular/material/button";
import {MatDialogModule} from "@angular/material/dialog";
import {MatInputModule} from "@angular/material/input";
import {DialogCreatePostComponent} from './dialog-create-post/dialog-create-post.component';
import {MatSelectModule} from "@angular/material/select";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatRadioModule} from "@angular/material/radio";
import {DialogEditPostComponent} from './dialog-edit-post/dialog-edit-post.component';
import {DialogDeletePostComponent} from './dialog-delete-post/dialog-delete-post.component';
import {DialogDeleteThreadComponent} from './dialog-delete-thread/dialog-delete-thread.component';
import {PostComponent} from './post/post.component';
import {MatCardModule} from "@angular/material/card";
import {MatIconModule} from "@angular/material/icon";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatBadgeModule} from "@angular/material/badge";
import {ReactivePostComponent} from "./reactive-Post/reactive-post.component";
import {DialogReportPostComponent} from "./dialog-report-post/dialog-report-post.component";


@NgModule({
  declarations: [
    DialogEditThreadComponent,
    DialogCreatePostComponent,
    DialogEditPostComponent,
    DialogDeletePostComponent,
    DialogDeleteThreadComponent,
    DialogReportPostComponent,
    PostComponent,
    ReactivePostComponent
  ],
    exports: [
        PostComponent,
        ReactivePostComponent
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
    MatRadioModule,
    MatCardModule,
    MatIconModule,
    MatTooltipModule,
    MatBadgeModule
  ]
})
export class UserThreadViewModule {
}
