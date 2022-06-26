import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from "@angular/router";
import {UserFull} from "../../data-access/models/userFull";
import {Post} from "../../data-access/models/post";
import {BackendService} from "../../data-access/services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditProfileComponent} from "./dialog-edit-profile/dialog-edit-profile.component";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {NotFoundError, Observable} from "rxjs";
import {DialogCreateCommentComponent} from "./dialog-create-comment/dialog-create-comment.component";
import {DidAThingServiceService} from "../../shared/did-a-thing/did-a-thing-service.service";

import {ThreadsSmallBackendModel} from "../../data-access/models/threadsSmallBackendModel";
import {UserFullBackend, UserFullBackendModel} from "../../data-access/models/userFullBackendModel";
import {PostsSmallBackendModel} from "../../data-access/models/PostsSmallBackendModel";

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss']
})
export class UserProfileViewComponent implements OnInit {
  // userFullObject: UserFull;
  userFullArrayModel: UserFullBackendModel = {data: []};
  userThreads: Observable<ThreadsSmallBackendModel>;
  userPosts: Observable<PostsSmallBackendModel>;
  vEnabled: boolean;

  // @ViewChild('about', {static: false}) about: ElementRef;
  // @ViewChild('username', {static: false}) username: ElementRef;
  // @ViewChild('location', {static: false}) location: ElementRef;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private backendService: BackendService,
              private backendServiceCom: BackendCommunicationService,
              private dialog: MatDialog,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private didAThing: DidAThingServiceService) {
  }


  async setVuln() {

    this.vEnabled = this.diffPicker.isEnabledInConfig("/users/{int}");
    // this.vEnabled = true;
  }

  ngOnInit() {
    this.setVuln()
    this.route.data.subscribe((resp: Data) => {
      console.log(resp) //drinnen lassen um kurz daten zu checken
      //
      // this.vEnabled = false;
      this.userFullArrayModel = resp["user"].body;
      console.log(this.userFullArrayModel)
      // this.userFullObject = {
      //   id: resp["user"].body.data.id,
      //   name: resp["user"].body.data.name,
      //   joined: resp["user"].body.data.joined,
      //   birth_date: resp["user"].body.data.birthDate,
      //   about: resp["user"].body.data.about,
      //   groups: resp["user"].body.data.groups,
      //   profile_comments: resp["user"].body.data.profileComments,
      //   profile_picture: resp["user"].body.data.profilePicture,
      //   location: resp["user"].body.data.location,
      //   endorsements: resp["user"].body.data.endorsements
      // }
      if (this.vEnabled) this.injectContentToDomStartup();
      console.log("is it?" + resp["user"]["headers"].get('VulnFound'))
      if (resp["user"]["headers"].get('VulnFound') == "true") {
        console.log("found vuln in userprofile")
        this.didAThing.sendMessage();
      }
      this.userThreads = this.backendServiceCom.getThreadsFromUser(this.userFullArrayModel.data[0].id);
      this.userPosts = this.backendServiceCom.getPostsFromUser(this.userFullArrayModel.data[0].id);
    });
  }

  // this.userThreads = this.backendServiceCom.getThreadsFromUser(this.userFullObject.id);
  // this.userPosts = this.backendServiceCom.getPostsFromUser(this.userFullObject.id);
  //
  //
  // this.userFullObject$ = this.route.data.pipe();
  // this.userThreads = this.backendService.getThreadsFromUser(this.userFullObject$.id);
  // this.userPosts = this.backendService.getPostsFromUser(this.userFullObject$.id);
  // this.routeData$ = this.route.data;
  //
  //  this.route.data.subscribe((data: any) => {
  //   this.userFullObject = data.user;
  //   this.userThreads = this.backendService.getThreadsFromUser(this.userFullObject.id);
  //   this.userPosts = this.backendService.getPostsFromUser(this.userFullObject.id);
  //   this.vEnabled = this.diffPicker.isEnabledInConfig();
  //   if (this.vEnabled) this.injectContentToDom();
  // });
  //
  //
  // startUp() {
  //   firstValueFrom(this.route.data).then((resp: any) => {
  //     console.log(resp) //drinnen lassen um kurz daten zu checken
  //     this.userFullObject = {
  //       id: resp.user.body.data.id,
  //       name: resp.user.body.data.name,
  //       joined: resp.user.body.data.joined,
  //       birth_date: resp.user.body.data.birthDate,
  //       about: resp.user.body.data.about,
  //       groups: resp.user.body.data.groups,
  //       profile_comments: resp.user.body.data.profileComments,
  //       profile_picture: resp.user.body.data.profilePicture,
  //       location: resp.user.body.data.location,
  //       endorsements: resp.user.body.data.endorsements
  //     }
  //     const keys = resp.headers.keys();
  //     let headers = keys.map(key =>
  //       `${key}: ${resp.headers.get(key)}`);
  //     console.log(headers)
  //
  //   });
  // }
  openEditProfileDialog(userFullObject: UserFullBackend): void {
    const dialogRef = this.dialog.open(DialogEditProfileComponent, {
      width: '65%',
      data: {
        name: userFullObject.name,
        about: userFullObject.about,
        profile_picture: userFullObject.profilePicture,
        location: userFullObject.location
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      userFullObject.name = result.name;
      userFullObject.about = result.about;
      userFullObject.profilePicture = result.profile_picture;
      userFullObject.location = result.location;
      this.backendServiceCom.putUser(userFullObject).subscribe(
        (resp: Data) => {
          console.log(resp)
          userFullObject = resp["body"].data;
          this.userFullArrayModel.data.forEach((user, index) => {
            if (user.id === userFullObject.id) {
              this.userFullArrayModel.data[index] = userFullObject;
            }
          });

          if (this.vEnabled) this.injectContentToDom(userFullObject);
          console.log(resp["headers"].get('VulnFound'))
          if (resp["headers"].get('VulnFound') == "true") {
            console.log("found vuln in userprofile")
            this.didAThing.sendMessage();
          }
        });
      // if (this.vEnabled) this.injectContentToDom();
    });
  }

  openCreateComment(profileId: number): void {
    const dialogRef = this.dialog.open(DialogCreateCommentComponent, {
      width: '65%',
      data: ""
    });
    dialogRef.afterClosed().subscribe(content => {
      this.backendServiceCom.postCommentOnProfile(profileId, this.authenticate.getCurrentUserId(), content).subscribe()
    });
  }


  injectContentToDomStartup(): void {
    for (let i = 0; i < this.userFullArrayModel.data.length; i++) {
      this.changeDetectorRef.detectChanges();
      let content = document.getElementById("content" + this.userFullArrayModel.data[i].id);
      content!.replaceChildren();
      content!.appendChild(document.createRange().createContextualFragment(this.userFullArrayModel.data[i].about));

      let name = document.getElementById("name" + this.userFullArrayModel.data[i].id);
      name!.replaceChildren();
      name!.appendChild(document.createRange().createContextualFragment(this.userFullArrayModel.data[i].name));

      let location = document.getElementById("location" + this.userFullArrayModel.data[i].id);
      location!.replaceChildren();
      location!.appendChild(document.createRange().createContextualFragment(this.userFullArrayModel.data[i].location));
    }
  }

  injectContentToDom(user: UserFullBackend): void {
    this.changeDetectorRef.detectChanges();
    console.log("content" + user.id.toString())
    let content = document.getElementById("content" + user.id);
    content!.replaceChildren();
    content!.appendChild(document.createRange().createContextualFragment(user.about));

    let name = document.getElementById("name" + user.id);
    name!.replaceChildren();
    name!.appendChild(document.createRange().createContextualFragment(user.name));

    let location = document.getElementById("location" + user.id);
    location!.replaceChildren();
    location!.appendChild(document.createRange().createContextualFragment(user.location));
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


  canEdit(id: number): boolean {
    return id == this.authenticate.getCurrentUserId();
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
