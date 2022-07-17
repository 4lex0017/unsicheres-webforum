import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {ActivatedRoute, Data, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditProfileComponent} from "./dialog-edit-profile/dialog-edit-profile.component";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {Observable} from "rxjs";
import {DialogCreateCommentComponent} from "./dialog-create-comment/dialog-create-comment.component";
import {DidAThingServiceService} from "../../shared/did-a-thing/did-a-thing-service.service";

import {ThreadsSmallBackendModel} from "../../data-access/models/threadsSmallBackendModel";
import {UserFullBackend, UserFullBackendModel} from "../../data-access/models/userFullBackendModel";
import {PostsSmallBackendModel} from "../../data-access/models/PostsSmallBackendModel";
import {UserCommentWrapper} from "../../data-access/models/comment";

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss']
})
export class UserProfileViewComponent implements OnInit {
  userFullArrayModel: UserFullBackendModel = {data: []};
  userThreads: Observable<ThreadsSmallBackendModel>;
  userPosts: Observable<PostsSmallBackendModel>;
  userComments: Observable<UserCommentWrapper>
  vEnabled: number;
  vEnabledFrontend: boolean


  constructor(private route: ActivatedRoute,
              private router: Router,
              private backendServiceCom: BackendCommunicationService,
              private dialog: MatDialog,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private didAThing: DidAThingServiceService) {
  }


  async setVuln() {
    await this.backendServiceCom.getVulnerabilitySingle("/users/{int}").then(value => {
        this.vEnabled = value
        this.vEnabledFrontend = this.isActive();
      }
    );
  }

  isActive(): boolean {
    return this.vEnabled != 0;
  }

  async ngOnInit() {
    await this.setVuln()
    this.route.data.subscribe((resp: Data) => {
      this.userFullArrayModel = resp["user"].body;
      if (this.vEnabled != 0) this.injectContentToDomStartup();
      if (resp["user"]["headers"].get('VulnFound') == "true") {
        this.didAThing.sendMessage();
      }
      this.userThreads = this.backendServiceCom.getThreadsFromUser(this.userFullArrayModel.data[0].id);
      this.userPosts = this.backendServiceCom.getPostsFromUser(this.userFullArrayModel.data[0].id);
      this.userComments = this.backendServiceCom.getCommentsFromUser(this.userFullArrayModel.data[0].id);
    });
  }


  filterDataModelInFrontendNormal(result: any, id: number): any {
    return {
      name: this.diffPicker.frontendFilterTagsNormal(result.name),
      about: this.diffPicker.frontendFilterTagsNormal(result.about),
      profilePicture: result.profilePicture,
      location: this.diffPicker.frontendFilterTagsNormal(result.location),
      id: id
    }
  }

  filterDataModelInFrontendHard(result: any, id: number): any {
    return {
      name: this.diffPicker.frontendFilterTagsHard(result.name),
      about: this.diffPicker.frontendFilterTagsHard(result.about),
      profilePicture: result.profilePicture,
      location: this.diffPicker.frontendFilterTagsHard(result.location),
      id: id
    }
  }

  public openEditProfileDialog(userFullObject: UserFullBackend): void {
    const dialogRef = this.dialog.open(DialogEditProfileComponent, {
      width: '65%',
      data:
        {
          name: userFullObject.name,
          about: userFullObject.about,
          profilePicture: userFullObject.profilePicture,
          location: userFullObject.location
        },
    });
    dialogRef.afterClosed().subscribe(result => {
      let newDataModel;
      if (this.vEnabled == 1) newDataModel = this.filterDataModelInFrontendNormal(result, userFullObject.id)
      else if (this.vEnabled == 2) newDataModel = this.filterDataModelInFrontendHard(result, userFullObject.id)
      else {
        newDataModel = {
          name: result.name,
          about: result.about,
          profilePicture: result.profilePicture,
          location: result.location,
          id: userFullObject.id
        }
      }
      this.backendServiceCom.putUser(newDataModel).subscribe(
        (resp: Data) => {
          userFullObject = resp["body"].data[0];
          this.userFullArrayModel.data.forEach((user, index) => {
            if (user.id === userFullObject.id) {
              this.userFullArrayModel.data[index] = userFullObject;
            }
          });
          if (this.vEnabled != 0) this.injectContentToDom(userFullObject);
          if (resp["headers"].get('VulnFound') == "true") {
            this.didAThing.sendMessage();
          }
        });
    });
  }

  openCreateComment(profileId: number): void {
    const dialogRef = this.dialog.open(DialogCreateCommentComponent, {
      width: '65%',
      data: ""
    });
    dialogRef.afterClosed().subscribe(content => {
      this.backendServiceCom.postCommentOnProfile(profileId, this.authenticate.getCurrentUserId(), content).subscribe(value => {
        this.userComments = this.backendServiceCom.getCommentsFromUser(this.userFullArrayModel.data[0].id);
      })
    });
  }

  isLoggedIn(): boolean {
    return this.authenticate.isLoggedIn();
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

      if (this.userFullArrayModel.data[i].location) {
        let location = document.getElementById("location" + this.userFullArrayModel.data[i].id);
        location!.replaceChildren();
        location!.appendChild(document.createRange().createContextualFragment(this.userFullArrayModel.data[i].location));
      }

    }
  }

  injectContentToDom(user: UserFullBackend): void {
    this.changeDetectorRef.detectChanges();
    let content = document.getElementById("content" + user.id);
    content!.replaceChildren();
    content!.appendChild(document.createRange().createContextualFragment(user.about));

    let name = document.getElementById("name" + user.id);
    name!.replaceChildren();
    name!.appendChild(document.createRange().createContextualFragment(user.name));

    if (user.location) {
      let location = document.getElementById("location" + user.id);
      location!.replaceChildren();
      location!.appendChild(document.createRange().createContextualFragment(user.location));
    }

  }

  cutPostContent(content: string): string {
    content = content.replace(/\r?\n|\r/g, " ");
    const rExp: RegExp = new RegExp("\\[quote=.*?:[0-9]*].*?\\[/quote]", "gmids");
    let test = content.split(rExp);
    content = " ";
    for (let i = 0; i < test.length; i++) {
      if (test[i] != "") {
        content = test[i]
        break;
      }
    }
    if (content.length > 35) {
      let subStr = content.slice(0, 32);
      subStr += "...";
      return subStr;
    } else {
      return content
    }
  }


  canEdit(id: number): boolean {
    return id == this.authenticate.getCurrentUserId() || this.authenticate.isAdmin();
  }

  getSlugFromTitle(title: string): string {
    return title.replace(/\s+/g, '-').toLowerCase();
  }


  parseDate(date: string): string {
    return this.backendServiceCom.formatDate(date);
  }

}
