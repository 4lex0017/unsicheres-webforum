import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Thread} from "../../data-access/models/thread";
import {ActivatedRoute, Router} from "@angular/router";
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
import {PostReply} from "../../data-access/models/postReply";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {DialogLoginComponent} from "../user-home/dialog/dialog-login/dialog-login.component";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  threadObject: Thread;
  vEnabled: boolean;
  @ViewChild('content', {static: false}) content: ElementRef;
  @ViewChild('title', {static: false}) title: ElementRef;

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  ngOnInit(): void {
    this.route.data.subscribe((data: any) => {
        this.threadObject = data.thread;
        this.vEnabled = this.diffPicker.isEnabledInConfig();
        if (this.vEnabled) {
          this.changeDetectorRef.detectChanges();

          this.content.nativeElement.replaceChildren();
          // this.threadObject.content = this.diffPicker.filterTagsEasy(this.threadObject.content);
          this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.content));

          this.title.nativeElement.replaceChildren();
          this.title.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.title));
        }
      }
    );
  }

  canEditThread(): boolean {
    if (this.threadObject.author.id == this.authenticate.currentUserId) return true;
    return false;
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
      if (this.vEnabled) {
        this.changeDetectorRef.detectChanges();

        this.content.nativeElement.replaceChildren();
        // this.threadObject.content = this.diffPicker.filterTagsEasy(this.threadObject.content);
        this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.content));

        this.title.nativeElement.replaceChildren();
        this.title.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.title));
      }

    });
  }

  openCreateDialog(): void {
    if (!this.checkLoggedIn()) return;
    let repliedTo: PostReply = {
      repliedToId: this.threadObject.id,
      repliedToContent: this.threadObject.author.username + " wrote '" + this.threadObject.content + "'."
    };
    const dialogRef = this.dialog.open(DialogCreatePostComponent, {
      width: '65%',
      data: {
        reply: repliedTo.repliedToContent,
        content: "",
        showReply: true,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (!result.showReply) {
        this.threadObject.posts.push(this.backEndService.createPostObject(this.authenticate.currentUserId, result.content));
      } else {
        this.threadObject.posts.push(this.backEndService.createPostObject(this.authenticate.currentUserId, result.content, repliedTo));
      }


    });
  }

  moveToPost(id: number) {
    window.location.hash = id.toString();
  }

  openDeletePostConsumer(postObjectId: number) {
    for (let z = 0; z < this.threadObject.posts.length; z++) {
      if (this.threadObject.posts[z].id == postObjectId) {
        this.threadObject.posts.splice(z, 1);
        break;
      }
    }
  }

  createPostConsumer(post: Post): void {
    this.threadObject.posts.push(post);
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
    if (!this.checkLoggedIn()) return;
    let i = this.threadObject.likedFrom.indexOf(this.authenticate.currentUserId);
    if (i != -1) {
      this.threadObject.likedFrom.splice(i, 1)
    } else {
      console.log(this.authenticate.currentUserId)
      this.threadObject.likedFrom.push(this.authenticate.currentUserId);
    }
  }


  checkLoggedIn(): boolean {
    if (!this.authenticate.currentUserId) {
      const dialogRef = this.dialog.open(DialogLoginComponent, {
        width: '30%',
      });
      return false;
    }
    return true;
  }

  getUserPicture(userId: number): HTMLImageElement | undefined {
    return this.backEndService.getUserPicture(userId);
  }


}

