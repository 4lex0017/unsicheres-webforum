import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../data-access/services/backend.service";
import {Access} from "../../../data-access/models/access";
import {DialogEditThreadComponent} from "../../user-thread-view/dialog-edit-thread/dialog-edit-thread.component";
import {MatDialog} from "@angular/material/dialog";
import {Thread} from "../../../data-access/models/thread";
import {DialogCreateThreadComponent} from "../dialog-create-thread/dialog-create-thread.component";
import {DataManagementService} from "../../../data-access/services/data-management.service";
import {Category} from "../../../data-access/models/category";
import {Router} from "@angular/router";
import {DialogSearchErrorMessageComponent} from "../dialog-search-error-message/dialog-search-error-message.component";
import {SearchService} from "../../../data-access/services/search.service";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor(private backEndService: BackendService,
              private dialog: MatDialog,
              private router: Router,
              private searchService: SearchService) {
  }

  accessData: Access;
  currentCategoryObject: Category;
  showFull = false;
  searchQuery: string = "";


  ngOnInit(): void {
    this.accessData = this.backEndService.loadData();
  }

  openDialog(): void {
    let selected = "";
    if (this.showFull) {
      selected = this.currentCategoryObject.title;
    }
    const dialogRef = this.dialog.open(DialogCreateThreadComponent, {
      width: '65%',
      data: {
        title: "",
        category: selected,
        content: "",
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      let newThread = this.backEndService.createThreadObject(result.title, result.content);
      this.addThread(newThread, result.category);
    });
  }

  addThread(threadObject: Thread, category: string): void {
    for (let z = 0; z < this.accessData.categories.length; z++) {
      if (this.accessData.categories[z].title == category) {
        this.accessData.categories[z].threads.push(threadObject);
      }
    }

  }

  showMoreEventConsumer($event) {
    this.showFull = $event.showMore;
    if ($event.showMore) {
      for (let z = 0; z < this.accessData.categories.length; z++) {
        if (this.accessData.categories[z].id == $event.showIndex) {
          this.currentCategoryObject = this.accessData.categories[z];
          break;
        }
      }
    }
  }

  clickSearch() {
    if (this.searchQuery == "") {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is empty."
        },
      });
    } else if (this.searchQuery.length > 50) {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is too long (Max length = 50)"
        },

      });
    } else {
      this.searchService.notifyRest(this.searchQuery);
      this.router.navigate(['forum/search']);
    }

  }


}
