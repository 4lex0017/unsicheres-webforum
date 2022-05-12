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
import {DialogLoginComponent} from "../user-home/sidenav/dialog-login/dialog-login.component";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  threadObject: Thread;
  contentDiff: boolean;
  private contentPlaceholder: ElementRef;

  @ViewChild('content', {static: false}) content: ElementRef;

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
        // <scr<script>ipt>alert(2)</script> -> works
        if (this.diffPicker.isEnabled(7, 2)) {
          this.contentDiff = true;
          this.changeDetectorRef.detectChanges();
          this.content.nativeElement.replaceChildren();
          // this.threadObject.content = this.diffPicker.filterTagsEasy(this.threadObject.content);
          this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.content));
        } else {
          this.contentDiff = false;
        }
      }
    );
  }

  canEditThread(): boolean {
    if (this.threadObject.author.id == this.authenticate.currentUserId) return true;
    return false;
  }

  canEditPost(post: any): boolean {
    if (post.author.id == this.authenticate.currentUserId) return true;
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
      if (this.contentDiff) {
        this.changeDetectorRef.detectChanges();
        this.content.nativeElement.replaceChildren();
        this.threadObject.content = this.diffPicker.filterTagsEasy(this.threadObject.content);
        console.log(this.threadObject.content)
        this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.content));
      }

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

  openCreateDialog(replyToContent: string, replyToUser: User, postId: number): void {
    if (!this.checkLoggedIn()) return;
    let repliedTo: PostReply = {
      repliedToId: postId,
      repliedToContent: replyToUser.username + " wrote '" + replyToContent + "'."
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
    if (!this.checkLoggedIn()) return;
    let i = this.threadObject.likedFrom.indexOf(this.authenticate.currentUserId);
    if (i != -1) {
      this.threadObject.likedFrom.splice(i, 1)
    } else {
      console.log(this.authenticate.currentUserId)
      this.threadObject.likedFrom.push(this.authenticate.currentUserId);
    }
  }

  likePostButton(post: Post): void {
    if (!this.checkLoggedIn()) return;
    let i = post.likedFrom.indexOf(this.authenticate.currentUserId);
    if (i != -1) {
      post.likedFrom.splice(i, 1)
    } else {
      post.likedFrom.push(this.authenticate.currentUserId);
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
}

