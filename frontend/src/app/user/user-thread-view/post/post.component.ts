import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from "../../../data-access/models/post";
import {DialogEditPostComponent} from "../dialog-edit-post/dialog-edit-post.component";
import {DialogDeletePostComponent} from "../dialog-delete-post/dialog-delete-post.component";
import {ActivatedRoute, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {BackendService} from "../../../data-access/services/backend.service";
import {DataManagementService} from "../../../data-access/services/data-management.service";
import {AuthenticationService} from "../../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../../data-access/services/difficulty-picker.service";

import {PostReply} from "../../../data-access/models/postReply";
import {DialogCreatePostComponent} from "../dialog-create-post/dialog-create-post.component";
import {DialogLoginComponent} from "../../user-home/dialog/dialog-login/dialog-login.component";

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.scss']
})
export class PostComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef) {
  }

  // @Input() elementRef: ElementRef;
  @Input() postObject: Post;
  @Output() deletePostEvent = new EventEmitter<number>();
  @Output() createPostEvent = new EventEmitter<Post>();
  @Output() moveToPostEvent = new EventEmitter<number>();
  @Output() replyPostEvent = new EventEmitter<Post>();
  vEnabled: boolean;
  @ViewChild('content', {static: false}) content: ElementRef;


  ngOnInit(): void {
    this.vEnabled = this.diffPicker.isEnabledInConfig("/threads/{int}/posts");
    if (this.vEnabled) {
      this.changeDetectorRef.detectChanges();
      this.content.nativeElement.replaceChildren();
      this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.postObject.content));
    }
  }

  // getUserPicture(): string | undefined {
  //   return this.backEndService.getUserPicture(this.postObject.author.id);
  // }

  canEditPost(): boolean {
    if (this.postObject.author.id == this.authenticate.getCurrentUserId()) return true;
    return false;
  }

  openEditPostDialog(): void {
    const dialogRef = this.dialog.open(DialogEditPostComponent, {
      width: '65%',
      data: {
        content: this.postObject.content,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.postObject.content = result.content;
      if (this.vEnabled) {
        this.changeDetectorRef.detectChanges();
        this.content.nativeElement.replaceChildren();
        this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.postObject.content));
      }
    });
  }

  openCreateDialog(): void {
    if (!this.checkLoggedIn()) return;
    let repliedTo: PostReply = {
      repliedToId: this.postObject.id,
      repliedToContent: this.postObject.author.name + " wrote '" + this.postObject.content + "'."
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
        this.createPostEvent.emit(this.backEndService.createPostObject(this.authenticate.getCurrentUserId(), result.content))
      } else {
        this.createPostEvent.emit(this.backEndService.createPostObject(this.authenticate.getCurrentUserId(), result.content, repliedTo))
      }
    });
  }

  moveToPost(): void {
    this.moveToPostEvent.emit(this.postObject.repliedTo?.repliedToId);
  }

  openDeletePostDialog() {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      width: '55%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.deletePostEvent.emit(this.postObject.id);
      }
    });
  }

  likePostButton(): void {
    if (!this.checkLoggedIn()) return;
    let i = this.postObject.likedFrom.indexOf(this.authenticate.getCurrentUserId());
    if (i != -1) {
      this.postObject.likedFrom.splice(i, 1)
    } else {
      this.postObject.likedFrom.push(this.authenticate.getCurrentUserId());
    }
  }

  checkLoggedIn(): boolean {
    if (!this.authenticate.isLoggedIn()) {
      const dialogRef = this.dialog.open(DialogLoginComponent, {
        width: '30%',
      });
      return false;
    }
    return true;
  }
}
