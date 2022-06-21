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
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";
import {Observable} from "rxjs";
import {Search} from "../../../data-access/models/search";

declare var jQuery: any;

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private backendService: BackendService,
              private backendCom: BackendCommunicationService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef
  ) {
  }

  search: Search = {users: [], posts: [], threads: []};
  currentSearchQuery: string;
  newSearchQuery: string = "";
  vEnabled: boolean;
  @ViewChild('search', {static: false}) content: ElementRef;


  async setVuln() {
    this.vEnabled = this.diffPicker.isEnabledInConfig("/search");
  }

  ngOnInit(): void {
    this.setVuln();
    this.route.queryParamMap.subscribe((params) => {
      this.currentSearchQuery = this.format(params.get('q') || "");
      this.backendCom.search(this.currentSearchQuery).subscribe(data => this.search = data);
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

  getSlugFromTitle(title: string): string {
    return this.backendCom.getSlugFromTitle(title);
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
      this.router.navigate(['forum/search'], {queryParams: {q: this.newSearchQuery.replace(/ /g, "_")}});
    }

  }
}
