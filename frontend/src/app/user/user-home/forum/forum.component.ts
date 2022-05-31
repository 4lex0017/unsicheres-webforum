import {Component, OnInit} from '@angular/core';
import {BackendService} from "../../../data-access/services/backend.service";
import {Access} from "../../../data-access/models/access";
import {MatDialog} from "@angular/material/dialog";
import {Thread} from "../../../data-access/models/thread";

import {Category} from "../../../data-access/models/category";
import {ActivatedRoute, Router} from "@angular/router";

import {AuthenticationService} from "../../../data-access/services/authentication.service";
import {DialogCreateThreadComponent} from "../dialog/dialog-create-thread/dialog-create-thread.component";
import {
  DialogSearchErrorMessageComponent
} from "../dialog/dialog-search-error-message/dialog-search-error-message.component";
import {DialogLoginComponent} from "../dialog/dialog-login/dialog-login.component";

@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor(public backEndService: BackendService,
              private dialog: MatDialog,
              private router: Router,
              private activeRoute: ActivatedRoute,
              public authenticate: AuthenticationService
  ) {
  }

  accessData: Access;
  currentCategoryObject: Category;
  showFull = false;
  searchQuery: string = "";

  canCreate(): boolean {
    return this.authenticate.currentUserId;
  }

  ngOnInit(): void {
    this.accessData = this.backEndService.loadData();
    this.activeRoute.queryParamMap.subscribe((params) => {
      if (params.get('view') == "community") {
        this.currentCategoryObject = this.accessData.categories.find(cat => cat.title == "Community")!;
        this.showFull = true;
      } else if (params.get('view') == "support") {
        this.currentCategoryObject = this.accessData.categories.find(cat => cat.title == "Support")!;
        this.showFull = true;
      } else if (params.get('view') == "general") {
        this.currentCategoryObject = this.accessData.categories.find(cat => cat.title == "General")!;
        this.showFull = true;
      } else {
        this.showFull = false;
      }
    });
  }

  openCreateThreadDialog(): void {
    if (!this.authenticate.currentUserId) {
      const dialogRef = this.dialog.open(DialogLoginComponent, {
        width: '30%',
      });
      return;
    }
    let selected = "";
    if (this.showFull) {
      selected = this.currentCategoryObject.title;
    }
    const dialogRef = this.dialog.open(DialogCreateThreadComponent, {
      width: '65%',
      data: {
        title: "",
        category: selected,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      let newThread = this.backEndService.createThreadObject(this.authenticate.currentUserId, result.title);
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

  clickSearch() {
    if (this.searchQuery == "") {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is empty."
        },
      });
    } else if (this.searchQuery.length > 200) {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is too long (Max length = 200)"
        },

      });
    } else {
      this.router.navigate(['forum/search'], {queryParams: {filter: this.searchQuery.replace(/ /g, "_")}});
    }

  }
}
