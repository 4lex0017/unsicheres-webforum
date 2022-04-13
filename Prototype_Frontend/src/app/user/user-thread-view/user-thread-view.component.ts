import { Component, OnInit } from '@angular/core';
import {Thread} from "../../data-access/models/thread";
import {ActivatedRoute} from "@angular/router";
import {DialogEditProfileComponent} from "../user-profile-view/dialog-edit-profile/dialog-edit-profile.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditThreadComponent} from "./dialog-edit-thread/dialog-edit-thread.component";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  threadObject: Thread;
  constructor(private route: ActivatedRoute, private dialog : MatDialog) { }

  ngOnInit(): void {
    this.route.data.subscribe( (data : any) => {
        this.threadObject = data.thread;
        console.log(this.threadObject.title+" is here");
      }
    );
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogEditThreadComponent, {
      width: '65%',
      data :{
        title: this.threadObject.title,
        content : this.threadObject.content
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.threadObject.title = result.title;
      this.threadObject.content = result.content;
    });
  }

}
