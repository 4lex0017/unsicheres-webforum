import {Component, OnInit, SecurityContext} from '@angular/core';
import {Thread} from "../../../data-access/models/thread";
import {Post} from "../../../data-access/models/post";
import {BackendService} from "../../../data-access/services/backend.service";
import {UserFull} from "../../../data-access/models/userFull";
import {DialogSearchErrorMessageComponent} from "../dialog-search-error-message/dialog-search-error-message.component";
import {ActivatedRoute, ParamMap, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";

declare var jQuery: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private backendService: BackendService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              // private difficulty: DifficultyService
  ) {
  }

  threads: Thread[] = [];
  posts: Post[] = [];
  users: UserFull[] = [];
  currentSearchQuery: string;
  newSearchQuery: string = "";
  paramsObject: ParamMap;
  unsafeValue: string = 'Template <script>alert("0wned")</script> <b>Syntax</b>';
  safeValue: string = "Test"
  unsafeCode;

  ngOnInit(): void {

    this.threads = this.backendService.getRandomThreads();
    this.posts = this.backendService.getRandomPosts();
    this.users = this.backendService.getRandomUsers();
    this.unsafeCode = this.sanitizer.bypassSecurityTrustHtml(this.unsafeValue)


    this.route.queryParamMap.subscribe((params) => {
      this.currentSearchQuery = this.format(params.get('filter') || "");
      // if (this.currentSearchQuery.includes("<script>"))  Nicht nur child anhängen!!
      document.getElementById('final')!.replaceChildren();
      document.getElementById('final')!.appendChild(document.createRange().createContextualFragment(this.currentSearchQuery));
    });
  }

  unsafeDisply(display: string): string {
    (function ($) {
      $(document).ready(function () {
        console.log("Hello from jQuery!");

        display;
      });
    })(jQuery);

    return display;
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

  getSlugFromTitle(title: string): string {
    return this.backendService.getSlugFromTitle(title);
  }

  clickSearch() {
    if (this.newSearchQuery == "") {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is empty."
        },
      });
    } else if (this.newSearchQuery.length > 200) {
      this.dialog.open(DialogSearchErrorMessageComponent, {
        data: {
          errorMessage: "The search query is too long (Max length = 200)"
        },
      });
    } else {
      this.router.navigate(['forum/search'], {queryParams: {filter: this.newSearchQuery.replace(/ /g, "_")}});
    }

  }
}
