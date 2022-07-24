import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {Thread} from "../../data-access/models/thread";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditThreadComponent} from "./dialog-edit-thread/dialog-edit-thread.component";
import {Post} from "../../data-access/models/post";
import {DialogDeleteThreadComponent} from "./dialog-delete-thread/dialog-delete-thread.component";
import {DataManagementService} from "../../data-access/services/data-management.service";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {DialogLoginComponent} from "../user-home/dialog/dialog-login/dialog-login.component";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {DidAThingServiceService} from "../../shared/did-a-thing/did-a-thing-service.service";
import {ThreadArrayModel} from "../../data-access/models/ThreadArrayModel";
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {Clipboard} from "@angular/cdk/clipboard";


@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  threadObjectArrayModel: ThreadArrayModel = {data: []};
  vEnabled: number
  vEnabledPost: number
  vEnabledFrontend: boolean;
  content: string = "";
  editId: number = -1;


  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backendServiceCom: BackendCommunicationService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private didAThing: DidAThingServiceService,
              private _snackBar: MatSnackBar,
              private clipboard: Clipboard) {
  }

  async setVulnThread() {
    await this.backendServiceCom.getVulnerabilitySingle("/threads/{int}").then(value => {
        this.vEnabled = value
        this.vEnabledFrontend = this.isActive();
      }
    );
  }

  async setVulnPost() {
    await this.backendServiceCom.getVulnerabilitySingle("/threads/{int}/posts").then(value => {
        this.vEnabledPost = value
      }
    );
  }

  isActive(): boolean {
    return this.vEnabled != 0;
  }

  injectContentToDomStartup() {
    for (let i = 0; i < this.threadObjectArrayModel.data.length; i++) {
      this.changeDetectorRef.detectChanges();
      let title = document.getElementById("title" + this.threadObjectArrayModel.data[i].id);
      title!.replaceChildren();
      title!.appendChild(document.createRange().createContextualFragment(this.threadObjectArrayModel.data[i].title));
    }
  }

  injectContentToDom(thread: Thread) {
    this.changeDetectorRef.detectChanges();
    let title = document.getElementById("title" + thread.id);
    title!.replaceChildren();
    title!.appendChild(document.createRange().createContextualFragment(thread.title));
  }

  async ngOnInit() {
    await this.setVulnPost();
    await this.setVulnThread();

    this.route.data.subscribe((resp: Data) => {
        this.threadObjectArrayModel = resp["thread"].body;
        if (this.vEnabled != 0) this.injectContentToDomStartup()
        if (resp["thread"]["headers"].get('VulnFound') == "true") {
          this.didAThing.sendMessage();
        }
      }
    );
  }

  formatDate(date: string): string {
    return this.backendServiceCom.formatDate(date);
  }

  canEditThread(id: number): boolean {
    return id == this.authenticate.getCurrentUserId() || this.authenticate.isAdmin();
  }


  openEditThreadDialog(threadObject: Thread): void {
    const dialogRef = this.dialog.open(DialogEditThreadComponent, {
      width: '65%',
      data: {
        title: threadObject.title,

      },
    });
    dialogRef.afterClosed().subscribe(result => {
      if (this.vEnabled == 1) threadObject.title = this.diffPicker.frontendFilterTagsNormal(result.title)
      else if (this.vEnabled == 2) threadObject.title = this.diffPicker.frontendFilterTagsHard(result.title)
      else threadObject.title = result.title;
      this.backendServiceCom.putThread(threadObject).subscribe(
        (resp: Data) => {
          let title = resp["body"].title;
          this.threadObjectArrayModel.data.forEach((thread, index) => {
            if (thread.id === threadObject.id) {
              this.threadObjectArrayModel.data[index].title = title;
            }
          });
          if (this.vEnabled != 0) this.injectContentToDom(threadObject)
          if (resp["headers"].get('VulnFound') == "true") {
            this.didAThing.sendMessage();
          }
        });
    });
  }

  moveToReply(id: number): void {
    this.changeDetectorRef.detectChanges();
    document.getElementById("replyBox" + id)!.focus();
  }

  addReply(threadObject: Thread, replyPost: Post): void {
    let regex = new RegExp("\\[quote=.*?](.*?)\\[/quote]", 'gmids');
    let currentFilter;
    let myValue = replyPost.content
    let lastMatchIndex = 0
    while ((currentFilter = regex.exec(replyPost.content)) != null) {
      if (currentFilter.index === regex.lastIndex) {
        regex.lastIndex++;
      }
      if (currentFilter.index === lastMatchIndex) {
        myValue = myValue.replace(currentFilter[0], '')
      } else {
        myValue = myValue.replace(currentFilter[0], '\n')
      }
      lastMatchIndex = regex.lastIndex
    }
    var myElement;
    if (this.editId != -1) {
      myElement = <HTMLTextAreaElement>document.getElementById("editBox" + this.editId);
    } else {
      myElement = <HTMLTextAreaElement>document.getElementById("replyBox" + threadObject.id);
    }
    var startPosition = myElement!.selectionStart;
    var endPosition = myElement!.selectionEnd;

    myElement.value = myElement.value.substring(0, startPosition)
      + "[quote=" + replyPost.author.name + ":" + replyPost.id + "]"
      + myValue
      + "[/quote]"
      + myElement.value.substring(endPosition, myElement.value.length);
  }

  createPost(threadObject: Thread): void {
    if (!this.checkLoggedIn()) return;
    let fullReply = <HTMLTextAreaElement>document.getElementById('replyBox' + threadObject.id);
    let replyString = fullReply.value;
    if(replyString.length <= 4){
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Message must contain at least 5 characters"
      })
      return;
    }
    if (this.vEnabledPost == 1) replyString = this.diffPicker.frontendFilterTagsNormal(replyString)
    else if (this.vEnabledPost == 2) replyString = this.diffPicker.frontendFilterTagsHard(replyString)
    this.backendServiceCom.postPost(threadObject.id, this.authenticate.getCurrentUserId(), replyString).subscribe((value: Data) => {
      let newPost = value["body"];
      threadObject.posts.push(newPost)
      if (value["headers"].get('VulnFound') == "true") {
        this.didAThing.sendMessage();
      }
    })
    fullReply.value = "";
  }

  currentEdit(post: Post) {
    if (this.editId == post.id) {
      this.editId = -1;
    } else {
      this.editId = post.id;
    }
  }

  moveToPost(id: number) {
    window.location.hash = "";
    window.location.hash = id.toString();
  }

  openDeletePostConsumer(threadObject: Thread, editId: number, postObjectId: number) {
    this.threadObjectArrayModel.data.forEach((thread, index) => {
      if (thread.id == threadObject.id) {
        for (let z = 0; z < threadObject.posts.length; z++) {
          if (threadObject.posts[z].id == postObjectId) {
            if (postObjectId == editId) {
              this.editId = -1
            }
            threadObject.posts.splice(z, 1);
            this.threadObjectArrayModel.data[index] = threadObject;
            this.backendServiceCom.deletePost(threadObject.id, postObjectId).subscribe()
            break;
          }
        }
      }
    })

  }

  createPostConsumer(threadObject: Thread, post: Post): void {
    threadObject.posts.push(post);
  }

  openDeleteThreadDialog(threadObject: Thread) {
    const dialogRef = this.dialog.open(DialogDeleteThreadComponent, {
      width: '55%',
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.dataManagement.notifyRest(threadObject.categoryId!, threadObject.id)
        this.router.navigate(['/forum/home']);
      }
    });
  }

  likeThreadButton(threadObject: Thread): void {
    if (!this.checkLoggedIn()) return;
    this.backendServiceCom.likeThread(threadObject.id).subscribe()
    let i = threadObject.likedFrom.indexOf(this.authenticate.getCurrentUserId());
    if (i != -1) {
      threadObject.likedFrom.splice(i, 1)
    } else {
      threadObject.likedFrom.push(this.authenticate.getCurrentUserId());
    }
  }

  copyUrl(postId: number): void {
    let url = window.location.href.split("#")
    this.clipboard.copy(url[0] + "#" + postId);
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      panelClass: ['snack-bar-background'],
      data: "Copied Link"
    })
  }


  checkLoggedIn(): boolean {
    if (!this.authenticate.isLoggedIn()) {
      this.dialog.open(DialogLoginComponent, {
        width: '30%',
      });
      return false;
    }
    return true;
  }

}
