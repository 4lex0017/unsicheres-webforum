import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Thread} from "../../../data-access/models/thread";
import {Post} from "../../../data-access/models/post";
import {BackendService} from "../../../data-access/services/backend.service";
import {UserFull} from "../../../data-access/models/userFull";

import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";
import {DifficultyPickerService} from "../../../data-access/services/difficulty-picker.service";
import {
  DialogSearchErrorMessageComponent
} from "../dialog/dialog-search-error-message/dialog-search-error-message.component";

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
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  threads: Thread[] = [];
  posts: Post[] = [];
  users: UserFull[] = [];
  currentSearchQuery: string;
  newSearchQuery: string = "";
  // queryDiff: boolean;
  vEnabled: boolean;
  @ViewChild('search', {static: false}) content: ElementRef;

  ngOnInit(): void {
    this.threads = this.backendService.getRandomThreads();
    this.posts = this.backendService.getRandomPosts();
    this.users = this.backendService.getRandomUsers();
    this.vEnabled = this.diffPicker.isEnabledInConfig();

    this.route.queryParamMap.subscribe((params) => {
      this.currentSearchQuery = this.format(params.get('filter') || "");
      if (this.vEnabled) {
        this.changeDetectorRef.detectChanges();
        this.content.nativeElement.replaceChildren();
        this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.currentSearchQuery));
      }
    });
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

  format(filter: string): string {
    return filter.replace(/_/g, " ");
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
