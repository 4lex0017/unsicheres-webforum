import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA} from "@angular/material/dialog";
import {CreateThreadData} from "../dialog-create-thread/dialog-create-thread.component";

@Component({
  selector: 'app-dialog-search-error-message',
  templateUrl: './dialog-search-error-message.component.html',
  styleUrls: ['./dialog-search-error-message.component.scss']
})
export class DialogSearchErrorMessageComponent {

  constructor(@Inject(MAT_DIALOG_DATA) public data: ErrorMessage) {
  }
}

export interface ErrorMessage {
  errorMessage: string;
}
