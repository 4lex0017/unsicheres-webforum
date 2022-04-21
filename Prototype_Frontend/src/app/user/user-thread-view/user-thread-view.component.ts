import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {Thread} from "../../data-access/models/thread";
import {ActivatedRoute, Router} from "@angular/router";
import {DialogEditProfileComponent} from "../user-profile-view/dialog-edit-profile/dialog-edit-profile.component";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditThreadComponent} from "./dialog-edit-thread/dialog-edit-thread.component";
import {DialogCreatePostComponent} from "./dialog-create-post/dialog-create-post.component";
import {BackendService} from "../../data-access/services/backend.service";
import {User} from "../../data-access/models/user";
import {DialogEditPostComponent} from "./dialog-edit-post/dialog-edit-post.component";
import {Post} from "../../data-access/models/post";
import {DialogDeletePostComponent} from "./dialog-delete-post/dialog-delete-post.component";
import {DialogDeleteThreadComponent} from "./dialog-delete-thread/dialog-delete-thread.component";
import {DataManagementService} from "../../data-access/services/data-management.service";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  threadObject: Thread;


  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private router: Router,
              private dataManagement: DataManagementService) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
        this.threadObject = data.thread;
        console.log(this.threadObject.title + " is here");
      }
    );
  }

  openEditThreadDialog(): void {
    const dialogRef = this.dialog.open(DialogEditThreadComponent, {
      width: '65%',
      data: {
        title: this.threadObject.title,
        content: this.threadObject.content
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.threadObject.title = result.title;
      this.threadObject.content = result.content;
      this.threadObject.slug = result.title.replace(/\s+/g, '-').toLowerCase();
    });
  }

  openEditPostDialog(postObject: Post): void {
    const dialogRef = this.dialog.open(DialogEditPostComponent, {
      width: '65%',
      data: {
        content: postObject.content,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      postObject.content = result.content;
    });
  }

  openCreateDialog(replyToContent: string, replyToUser: User): void {
    let repliedTo: string = replyToUser.username + " wrote '" + replyToContent + "'.";
    const dialogRef = this.dialog.open(DialogCreatePostComponent, {
      width: '65%',
      data: {
        reply: repliedTo,
        content: "",
        showReply: true,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result.showReply) repliedTo = "";
      this.threadObject.posts.push(this.backEndService.createPostObject(result.content, repliedTo));

    });
  }

  openDeletePostDialog(postObjectId: number) {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      width: '55%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        for (let z = 0; z < this.threadObject.posts.length; z++) {
          if (this.threadObject.posts[z].id == postObjectId) {
            this.threadObject.posts.splice(z, 1);
            break;
          }
        }
      }
    });
  }

  openDeleteThreadDialog() {
    const dialogRef = this.dialog.open(DialogDeleteThreadComponent, {
      width: '55%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataManagement.notifyRest(this.threadObject.id)
        this.router.navigate(['/forum/home']);
      }
    });
  }

  likeThreadButton(): void {
    this.threadObject.endorsements++;
  }

  likePostButton(post: Post): void {
    post.endorsements++;
  }

}

