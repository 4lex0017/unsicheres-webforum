import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Data} from "@angular/router";
import {UserFull} from "../../data-access/models/userFull";
import {Thread} from "../../data-access/models/thread";
import {Post} from "../../data-access/models/post";
import {BackendService} from "../../data-access/services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditProfileComponent} from "./dialog-edit-profile/dialog-edit-profile.component";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import * as Buffer from "buffer";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {firstValueFrom, Observable} from "rxjs";
import {UserComment} from "../../data-access/models/comment";
import {DialogCreateCommentComponent} from "./dialog-create-comment/dialog-create-comment.component";

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss']
})
export class UserProfileViewComponent implements OnInit {
  userFullObject: UserFull;
  userThreads: Observable<Thread[]>;
  userPosts: Observable<Post[]>;
  vEnabled: boolean;

  @ViewChild('about', {static: false}) about: ElementRef;
  @ViewChild('username', {static: false}) username: ElementRef;

  constructor(private route: ActivatedRoute,
              private backendService: BackendService,
              private backendServiceCom: BackendCommunicationService,
              private dialog: MatDialog,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  ngOnInit() {
    this.startUp();
    this.userThreads = this.backendServiceCom.getThreadsFromUser(this.userFullObject.id);
    this.userPosts = this.backendServiceCom.getPostsFromUser(this.userFullObject.id);
    // this.userFullObject$ = this.route.data.pipe();
    // this.userThreads = this.backendService.getThreadsFromUser(this.userFullObject$.id);
    // this.userPosts = this.backendService.getPostsFromUser(this.userFullObject$.id);
    // this.routeData$ = this.route.data;

    //  this.route.data.subscribe((data: any) => {
    //   this.userFullObject = data.user;
    //   this.userThreads = this.backendService.getThreadsFromUser(this.userFullObject.id);
    //   this.userPosts = this.backendService.getPostsFromUser(this.userFullObject.id);
    //   this.vEnabled = this.diffPicker.isEnabledInConfig();
    //   if (this.vEnabled) this.injectContentToDom();
    // });


  }

  //Geht gerade nicht weil array format im backend nicht passt, kann auch wieder in onInit
  async startUp() {
    await firstValueFrom(this.route.data).then((data: any) => {
      console.log(data) //drinnen lassen um kurz daten zu checken
      this.userFullObject = {
        id: data.user.data.id,
        name: data.user.data.name,
        joined: data.user.data.joined,
        birth_date: data.user.data.birthDate,
        about: data.user.data.about,
        groups: data.user.data.groups,
        profile_comments: data.user.data.profileComments, // Wird vl nicht richtig angezeigt weil model nicht übereinstimmt
        profile_picture: data.user.data.profilePicture,
        location: data.user.data.location,
        endorsements: data.user.data.endorsements
      }

    });
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(DialogEditProfileComponent, {
      width: '65%',
      data: {
        name: this.userFullObject.name,
        about: this.userFullObject.about,
        profile_picture: this.userFullObject.profile_picture,
        location: this.userFullObject.location
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.userFullObject.name = result.name;
      this.userFullObject.about = result.about;
      this.userFullObject.profile_picture = result.profile_picture;
      this.userFullObject.location = result.location;
      this.backendServiceCom.putUser(this.userFullObject).subscribe();
      if (this.vEnabled) this.injectContentToDom();
    });
  }

  openCreateComment(): void {
    const dialogRef = this.dialog.open(DialogCreateCommentComponent, {
      width: '65%',
      data: ""
    });
    dialogRef.afterClosed().subscribe(result => {
      this.createComment(result);
    });
  }

  createComment(content: string): void {
    this.authenticate.currentUserId;
    //  BACKEND POST /user/userView/comments -> enthält curUserId + content
  }

  injectContentToDom(): void {
    this.changeDetectorRef.detectChanges();
    // this.userFullObject.about = this.diffPicker.filterTagsHard(this.userFullObject.about); to be done in backend
    this.about.nativeElement.replaceChildren();
    this.about.nativeElement.appendChild(document.createRange().createContextualFragment(this.userFullObject.about));
    this.username.nativeElement.replaceChildren();
    this.username.nativeElement.appendChild(document.createRange().createContextualFragment(this.userFullObject.name));
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
    return title.replace(/\s+/g, '-').toLowerCase();
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

  parseDate(date: string): string {
    let dateObj: Date = new Date(date);
    return (
      [
        this.padTo2Digits(dateObj.getDate()),
        this.padTo2Digits(dateObj.getMonth() + 1),
        dateObj.getFullYear(),
      ].join('.'));
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }
}
