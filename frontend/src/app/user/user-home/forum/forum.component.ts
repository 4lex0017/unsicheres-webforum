import {Component, OnInit} from '@angular/core';
import {MatDialog} from "@angular/material/dialog";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {AuthenticationService} from "../../../data-access/services/authentication.service";
import {DialogCreateThreadComponent} from "../dialog/dialog-create-thread/dialog-create-thread.component";
import {
  DialogSearchErrorMessageComponent
} from "../dialog/dialog-search-error-message/dialog-search-error-message.component";
import {DialogLoginComponent} from "../dialog/dialog-login/dialog-login.component";
import {Observable} from "rxjs";
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";
import {AccessBackend} from "../../../data-access/models/accessBackend";
import {SideContentThreadObject} from "../../../data-access/models/sidecontent";


@Component({
  selector: 'app-forum',
  templateUrl: './forum.component.html',
  styleUrls: ['./forum.component.scss']
})
export class ForumComponent implements OnInit {

  constructor(private backendComService: BackendCommunicationService,
              private dialog: MatDialog,
              private router: Router,
              private activeRoute: ActivatedRoute,
              public authenticate: AuthenticationService
  ) {
  }

  curId: number = -1;
  curTitle: string = "";
  sideContentUsers: Observable<any>;
  sideContentThreads: Observable<SideContentThreadObject>;
  accessBackend: Observable<AccessBackend>;
  showFull = false;
  searchQuery: string = "";
  categoryMap = new Map<string, number>().set("support", 53).set("community", 51).set("general", 52)
  whereToSearch: string = "all";
  searchParas: string[] = ["all", "users", "posts", "threads"]

  canCreate(): boolean {
    return this.authenticate.isLoggedIn();
  }


  ngOnInit(): void {
    this.accessBackend = this.backendComService.getCategories();
    this.sideContentUsers = this.backendComService.getSideContentUsers();
    this.sideContentThreads = this.backendComService.getSideContentThreads();
    this.activeRoute.queryParamMap.subscribe((params) => {
      if (params.get('view') != "all" && params.get('view') != null) {
        let para = params.get('view');
        this.showFull = true;
        this.accessBackend.subscribe(data => {
          let cat = data.categories.find(cat => cat.title.toLowerCase() == para);
          this.accessBackend = this.backendComService.getCategory(cat!.id);
          this.curId = cat!.id;
          this.curTitle = cat!.title;
        });
      } else {
        this.accessBackend = this.backendComService.getCategories();
        this.curId = -1;
        this.curTitle = "";
        this.showFull = false;
      }
    });
  }

  openCreateThreadDialog(): void {
    if (!this.authenticate.isLoggedIn()) {
      this.dialog.open(DialogLoginComponent, {
        width: '30%',
      });
      return;
    }
    const dialogRef = this.dialog.open(DialogCreateThreadComponent, {
      width: '65%',
      data: {
        title: "",
        category: this.curTitle,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.backendComService.postThread(this.categoryMap.get(result.category.toLowerCase())!, result.title, this.authenticate.getCurrentUserId()).subscribe((resp: Data) => {
        this.router.navigate(['forum/home'], {queryParams: {view: result.category.toLowerCase()}});
      });
    });
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
      this.router.navigate(['forum/search'], {queryParams: {scope: this.whereToSearch, query: this.searchQuery}});
    }
  }

  formatDate(date: string) {
    return this.backendComService.formatDate(date);
  }
}
