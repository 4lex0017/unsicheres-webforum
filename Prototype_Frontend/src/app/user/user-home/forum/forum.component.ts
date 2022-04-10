import { Component, OnInit } from '@angular/core';
import {BackendService} from "../../../data-access/services/backend.service";
import {Access} from "../../../data-access/models/access";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor( private backEndService : BackendService) { }
  accessData: Access;

  ngOnInit(): void {
    this.accessData = this.backEndService.loadBoard();
  }

}
