import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DomSanitizer} from "@angular/platform-browser";
import {DifficultyPickerService} from "../../../data-access/services/difficulty-picker.service";
import {
  DialogSearchErrorMessageComponent
} from "../dialog/dialog-search-error-message/dialog-search-error-message.component";
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";
import {Search} from "../../../data-access/models/search";
import {DidAThingServiceService} from "../../../shared/did-a-thing/did-a-thing-service.service";

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {

  constructor(private backendCom: BackendCommunicationService,
              private router: Router,
              private dialog: MatDialog,
              private route: ActivatedRoute,
              private sanitizer: DomSanitizer,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private didAThing: DidAThingServiceService
  ) {
  }

  search: Search = {users: [], posts: [], threads: []};
  currentSearchQuery: string;
  newSearchQuery: string = "";
  vEnabled: number;
  vEnabledFrontend: boolean
  whereToSearch: string = "all";
  searchParas: string[] = ["all", "users", "posts", "threads"]
  @ViewChild('search', {static: false}) content: ElementRef;


  async setVuln(str: string) {
    if (str == "all") str = "";
    if (str != "") str = "/" + str;
    await this.backendCom.getVulnerabilityReflectedSingle("/search" + str).then(value => {
        this.vEnabled = value
        console.log(this.vEnabled)
        this.vEnabledFrontend = this.isActive();
      }
    );
  }

  isActive(): boolean {
    return this.vEnabled != 0;
  }

  async ngOnInit() {
    await this.setVuln(this.whereToSearch);
    await this.route.queryParamMap.subscribe((params) => {
      this.currentSearchQuery = "";
      this.backendCom.search(params.get('query') || "", params.get('scope') || "").subscribe(data => {
        this.setVuln(params.get('scope') || "");
        this.currentSearchQuery = decodeURIComponent(this.getParaFromResponseUrl(data["headers"].get("self")!))
        console.log("cur query" + this.currentSearchQuery);
        console.log("is vuln enabled?: " + this.vEnabled);
        this.search = data["body"]!
        if (this.vEnabled != 0) {
          this.changeDetectorRef.detectChanges();
          this.content.nativeElement.replaceChildren();
          this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.currentSearchQuery));
        }
        console.log(data["headers"].get('VulnFound') == "true")
        if (data["headers"].get('VulnFound') == "true") {
          console.log("found vuln in userprofile")
          this.didAThing.sendMessage();
        }
      });
    });
  }

  getParaFromResponseUrl(url: string) {
    url = url.replace("/search?q=", "");
    url = url.replace("/search/users?q=", "");
    url = url.replace("/search/threads?q=", "");
    url = url.replace("/search/posts?q=", "");
    return url;
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
      this.router.navigate(['forum/search'], {queryParams: {scope: this.whereToSearch, query: this.newSearchQuery}});
    }
  }
}
