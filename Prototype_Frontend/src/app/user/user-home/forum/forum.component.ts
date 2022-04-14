import { Component, OnInit } from '@angular/core';
import {BackendService} from "../../../data-access/services/backend.service";
import {Access} from "../../../data-access/models/access";
import {DialogEditThreadComponent} from "../../user-thread-view/dialog-edit-thread/dialog-edit-thread.component";
import {MatDialog} from "@angular/material/dialog";
import {Thread} from "../../../data-access/models/thread";
import {DialogCreateThreadComponent} from "../dialog-create-thread/dialog-create-thread.component";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor( private backEndService : BackendService, private dialog: MatDialog) { }
  accessData: Access;


  ngOnInit(): void {
    this.accessData = this.backEndService.loadData();
  }
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogCreateThreadComponent, {
      width: '65%',
      data :{
        title: "",
        category:"",
        content : ""
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      let newThread = this.backEndService.createThreadObject(result.title, result.content);
      this.addThread(newThread, result.category);
    });
  }
  addThread(threadObject:Thread, category:string):void{
    for(let z = 0; z < this.accessData.categories.length; z++){
      if(this.accessData.categories[z].title == category){
        this.accessData.categories[z].threads.push(threadObject);
      }
    }

  }


}
