import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserFull} from "../../data-access/models/userFull";
import {Thread} from "../../data-access/models/thread";
import {Post} from "../../data-access/models/post";
import {BackendService} from "../../data-access/services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditProfileComponent} from "./dialog-edit-profile/dialog-edit-profile.component";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import * as Buffer from "buffer";

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss']
})
export class UserProfileViewComponent implements OnInit {
  userFullObject: UserFull;
  userThreads: Thread[];
  userPosts: Post[];
  vEnabled: boolean;

  @ViewChild('about', {static: false}) about: ElementRef;
  @ViewChild('username', {static: false}) username: ElementRef;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private dialog: MatDialog,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
      this.userFullObject = data.user;
      this.userThreads = this.backendService.getThreadsFromUser(this.userFullObject.id);
      this.userPosts = this.backendService.getPostsFromUser(this.userFullObject.id);
      this.vEnabled = this.diffPicker.isEnabledInConfig();
      if (this.vEnabled) this.injectContentToDom();
    });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(DialogEditProfileComponent, {
      width: '65%',
      data: {
        username: this.userFullObject.username,
        about: this.userFullObject.about,
        image: this.userFullObject.image,
        location: this.userFullObject.location
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.userFullObject.username = result.username;
      this.userFullObject.about = result.about;
      this.userFullObject.image = result.image;

      this.userFullObject.location = result.location;
      if (this.vEnabled) this.injectContentToDom();
    });
  }

  injectContentToDom(): void {
    this.changeDetectorRef.detectChanges();
    // this.userFullObject.about = this.diffPicker.filterTagsHard(this.userFullObject.about); to be done in backend
    this.about.nativeElement.replaceChildren();
    this.about.nativeElement.appendChild(document.createRange().createContextualFragment(this.userFullObject.about));
    this.username.nativeElement.replaceChildren();
    this.username.nativeElement.appendChild(document.createRange().createContextualFragment(this.userFullObject.username));
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


  canEdit(): boolean {
    return this.userFullObject.id == this.authenticate.currentUserId;

  }

  getSlugFromTitle(title: string): string {
    return this.backendService.getSlugFromTitle(title);
  }

  getCategoryFromThread(id: number): string {
    return this.backendService.getCategoryStrFromThreadId(id);
  }

  getThreadFromPost(id: number): string {
    return this.backendService.getThreadSlugFromPostId(id)
  }

  getFullUserFromUserId(id: number): UserFull {
    return this.backendService.getFullUserFromUserId(id);
  }
}
