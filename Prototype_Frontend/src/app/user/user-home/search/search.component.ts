import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Thread} from "../../../data-access/models/thread";
import {Post} from "../../../data-access/models/post";
import {BackendService} from "../../../data-access/services/backend.service";
import {UserFull} from "../../../data-access/models/userFull";
import {SearchService} from "../../../data-access/services/search.service";
import {DialogSearchErrorMessageComponent} from "../dialog-search-error-message/dialog-search-error-message.component";
import {Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private backendService: BackendService,
              private searchService: SearchService,
              private router: Router,
              private dialog: MatDialog) {
  }


  threads: Thread[] = [];
  posts: Post[] = [];
  users: UserFull[] = [];
  currentSearchQuery: string;
  newSearchQuery: string = "";

  ngOnInit(): void {

    this.threads = this.backendService.getRandomThreads();
    this.posts = this.backendService.getRandomPosts();
    this.users = this.backendService.getRandomUsers();
    this.searchService.notifyOthersObservable$.subscribe((str: string) => {
      this.currentSearchQuery = str;
      console.log("Inside " + this.currentSearchQuery);

    });
    console.log("Outside " + this.currentSearchQuery);

  }

  cutPostContent(content: string): string {
    if (content.length > 25) {
      let subStr = content.slice(0, 22);
      subStr += "...";
      return subStr;
    } else {
      return content
    }
  }

  getCategoryFromThread(id): string {
    return this.backendService.getCategoryStrFromThreadId(id);
  }

  getThreadSlugFromPostId(id) {
    return this.backendService.getThreadSlugFromPostId(id);
  }

  clickSearch() {
    if (this.newSearchQuery == "") {
      this.dialog.open(DialogSearchErrorMessageComponent)
    } else {
      this.searchService.notifyRest(this.newSearchQuery);
      this.router.navigate(['forum/search']);
    }

  }
}
