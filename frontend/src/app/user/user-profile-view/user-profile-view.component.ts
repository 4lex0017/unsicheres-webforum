import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {UserFull} from "../../data-access/models/userFull";
import {Thread} from "../../data-access/models/thread";
import {Post} from "../../data-access/models/post";
import {BackendService} from "../../data-access/services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditProfileComponent} from "./dialog-edit-profile/dialog-edit-profile.component";
import {UserComment} from "../../data-access/models/comment";
import {AuthenticationService} from "../../data-access/services/authentication.service";

@Component({
  selector: 'app-user-profile-view',
  templateUrl: './user-profile-view.component.html',
  styleUrls: ['./user-profile-view.component.scss']
})
export class UserProfileViewComponent implements OnInit {
  userFullObject: UserFull;
  userThreads: Thread[];
  userPosts: Post[];

  constructor(private route: ActivatedRoute, private backendService: BackendService, private dialog: MatDialog, public authenticate: AuthenticationService) {
  }

  canEdit(): boolean {
    if (this.userFullObject.id == this.authenticate.currentUserId) return true;
    return false;
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
        this.userFullObject = data.user;
        this.userThreads = this.backendService.getThreadsFromUser(this.userFullObject.id);
        this.userPosts = this.backendService.getPostsFromUser(this.userFullObject.id);
        console.log(this.userFullObject.id + " is here");
      }
    );
  }

  openEditProfileDialog(): void {
    const dialogRef = this.dialog.open(DialogEditProfileComponent, {
      width: '65%',
      //data: {name: this.name, animal: this.animal},
      data: {
        username: this.userFullObject.username,
        about: this.userFullObject.about,
        image: this.userFullObject.image
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
      this.userFullObject.username = result.username;
      this.userFullObject.about = result.about;
      this.userFullObject.image = result.image;
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
