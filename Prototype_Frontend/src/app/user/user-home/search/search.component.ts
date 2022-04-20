import {Component, OnInit} from '@angular/core';
import {Thread} from "../../../data-access/models/thread";
import {Post} from "../../../data-access/models/post";
import {BackendService} from "../../../data-access/services/backend.service";
import {UserFull} from "../../../data-access/models/userFull";
import {DialogSearchErrorMessageComponent} from "../dialog-search-error-message/dialog-search-error-message.component";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private backendService: BackendService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute) {
  }

  // filter$: Observable<string>;
  threads: Thread[] = [];
  posts: Post[] = [];
  users: UserFull[] = [];
  currentSearchQuery: string;
  newSearchQuery: string = "";
  paramsObject: ParamMap;

  ngOnInit(): void {

    this.threads = this.backendService.getRandomThreads();
    this.posts = this.backendService.getRandomPosts();
    this.users = this.backendService.getRandomUsers();

    this.route.queryParamMap.subscribe((params) => {
      this.currentSearchQuery = this.format(params.get('filter') || "");
    });
  }

  format(filter: string): string {
    return filter.replace(/_/g, " ");
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
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is empty."
        },
      });
    } else if (this.newSearchQuery.length > 50) {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is too long (Max length = 50)"
        },
      });
    } else {
      this.router.navigate(['forum/search'], {queryParams: {filter: this.newSearchQuery.replace(/ /g, "_")}});
    }

  }
}
