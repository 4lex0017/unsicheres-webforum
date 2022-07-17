import {
  AfterViewInit, ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output
} from '@angular/core';
import {Post} from "../../../data-access/models/post";
import {DialogDeletePostComponent} from "../dialog-delete-post/dialog-delete-post.component";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DataManagementService} from "../../../data-access/services/data-management.service";
import {AuthenticationService} from "../../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../../data-access/services/difficulty-picker.service";
import {DialogLoginComponent} from "../../user-home/dialog/dialog-login/dialog-login.component";
import {AllowEditService} from "../../../data-access/services/allowEdit.service";
import {DialogReportPostComponent} from "../dialog-report-post/dialog-report-post.component";
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";
import {DidAThingServiceService} from "../../../shared/did-a-thing/did-a-thing-service.service";
import {SnackBarNotificationComponent} from "../../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";


@Component({
  selector: 'app-reactive-post',
  templateUrl: './reactive-post.component.html',
  styleUrls: ['./reactive-post.component.scss']
})
export class ReactivePostComponent implements OnInit, AfterViewInit {

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private allowEditService: AllowEditService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private backendServiceCom: BackendCommunicationService,
              private didAThing: DidAThingServiceService,
              private _snackBar: MatSnackBar) {
  }

  @Input() threadId: number;
  @Input() vEnabled: number;
  @Input() postObject: Post;
  @Output() deletePostEvent = new EventEmitter<number>();
  @Output() createPostEvent = new EventEmitter<Post>();
  @Output() moveToPostEvent = new EventEmitter<number>();
  @Output() replyPostEvent = new EventEmitter<Post>();
  @Output() editPostEvent = new EventEmitter<Post>();
  @Output() moveToReplyBoxEvent = new EventEmitter;
  @Output() shareEvent = new EventEmitter<number>();
  vEnabledFrontend: boolean;
  editing: boolean = false;

  isActive(): boolean {
    return this.vEnabled != 0;
  }

  ngOnInit() {
    this.vEnabledFrontend = this.isActive();
  }

  ngAfterViewInit(): void {
    this.deserializePost(this.postObject.content)
  }

  parseDate(date: string): string {
    return this.backendServiceCom.formatDate(date);
  }


  canEditPost(): boolean {
    return this.postObject.author.id == this.authenticate.getCurrentUserId() || this.authenticate.isAdmin();
  }

  openDeletePostDialog() {
    const dialogRef = this.dialog.open(DialogDeletePostComponent, {
      width: '55%',
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.editing) {
          this.allowEditService.finishEdit();
          this.editPostEvent.emit(this.postObject)
        }
        this.deletePostEvent.emit(this.postObject.id);
      }
    });
  }

  likePostButton(): void {
    if (!this.checkLoggedIn()) return;
    this.backendServiceCom.likePost(this.threadId, this.postObject.id).subscribe()
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

  editPost(): void {
    if (this.allowEditService.askForEdit()) {
      let contentBox = document.getElementById("postBox" + this.postObject.id)
      while (contentBox!.firstChild) {
        contentBox!.removeChild(contentBox!.lastChild!)
      }
      this.editing = true;
      this.editPostEvent.emit(this.postObject)
    }
  }

  editContent(): void {
    let fullreply = <HTMLTextAreaElement>document.getElementById("editBox" + this.postObject.id)
    let editString = fullreply.value;
    if(editString.length <= 4){
      this._snackBar.openFromComponent(SnackBarNotificationComponent, {
        duration: 5000,
        panelClass: ['snack-bar-background'],
        data: "Message must contain at least 5 characters"
      })
      return;
    }
    this.editPostEvent.emit(this.postObject)
    this.editing = false
    if (this.vEnabled == 1) this.postObject.content = this.diffPicker.frontendFilterTagsNormal(editString)
    else if (this.vEnabled == 2) this.postObject.content = this.diffPicker.frontendFilterTagsHard(editString)
    else this.postObject.content = editString;
    this.backendServiceCom.putPost(this.threadId, this.postObject.author.id, this.postObject.id, this.postObject.content).subscribe(
      (value: Data) => {
        let editedContent = value["body"].content;
        this.postObject.content = editedContent;
        if (value["headers"].get('VulnFound') == "true") {
          this.didAThing.sendMessage();
        }
      }
    )
    this.allowEditService.finishEdit();
    this.deserializePost(this.postObject.content);
  }

  deserializePost(postContent: string): void {
    let contentBox = document.getElementById("postBox" + this.postObject.id)
    postContent = postContent.replace(/quote]\r?\n|\r/g, "quote]")
    const splitRegex = new RegExp("\\[quote=.*?:[0-9]*](.*?)\\[/quote]", 'gmids');
    let current;
    let lastMatchIndex = 0;
    let dividedContent: string[] = new Array(0)
    while ((current = splitRegex.exec(postContent)) !== null) {
      if (current.index === splitRegex.lastIndex) {
        splitRegex.lastIndex++;
      }
      if ((postContent.substring(lastMatchIndex, current.index)) != "") {
        dividedContent.push(postContent.substring(lastMatchIndex, current.index))
      }
      dividedContent.push(postContent.substring(current.index, splitRegex.lastIndex))
      lastMatchIndex = splitRegex.lastIndex;
    }

    if (lastMatchIndex != postContent.length) {
      dividedContent.push(postContent.substring(lastMatchIndex))
    }
    const replyInfoRegex = new RegExp("\\[quote=(.*?)]", 'mid');
    const userNameRegex = new RegExp("(?<=\=)(.*?)(?=\:)", 'mid');
    const postIdRegex = new RegExp("(?<=\:)(.*?)(?=\])", 'mid');
    for (let i = 0; i < dividedContent.length; i++) {
      if (dividedContent[i].startsWith("[")) {
        let infos = replyInfoRegex.exec(dividedContent[i]);
        let info = infos![0];
        let userName = userNameRegex.exec(info);
        let postId = postIdRegex.exec(info)
        let blockElement = document.createElement("blockquote");
        blockElement.setAttribute("id", postId![1])
        blockElement.setAttribute("id", this.postObject.id + "rep" + postId![1])
        blockElement.addEventListener("click", (e: Event) => this.moveToPost(blockElement.id))
        blockElement.setAttribute("style", "borderRadius: 1px ; border : solid #0643b8; margin-Left: 20px ; width : 95% ; border-Left-Width : 8px; border-Spacing : 10px");
        let p = document.createElement("p");
        p.style.whiteSpace = "pre-line"
        let div = document.createElement("div");
        div.style.whiteSpace = "pre-line"
        div.style.overflowWrap = "break-word"
        const blockRegex = new RegExp("\\[quote=.*?:[0-9]*](.*?)\\[/quote]", 'gmids');
        let blockContent = blockRegex.exec(dividedContent[i])
        if (this.vEnabledFrontend) {
          p.appendChild(document.createRange().createContextualFragment(userName![1]))
          div.appendChild(document.createRange().createContextualFragment(blockContent![1]))
        } else {
          p.textContent = userName![1];
          div.textContent = blockContent![1];
        }
        blockElement.appendChild(p);
        blockElement.appendChild(div);
        contentBox!.appendChild(blockElement)
      } else {
        let divElement = document.createElement("div")
        divElement.style.whiteSpace = "pre-line"
        divElement.style.overflowWrap = "break-word"
        if (this.vEnabledFrontend) {
          divElement.appendChild(document.createRange().createContextualFragment(dividedContent[i]))
        } else {
          divElement.textContent = dividedContent[i]
        }
        contentBox!.appendChild(divElement);
      }
    }
  }

  moveToPost(id: string) {
    let str = this.postObject.id + "rep"
    let cleanId = id.replace(str, "")
    this.moveToPostEvent.emit(+cleanId)
  }

  openReportDialog(): void {
    const dialogRef = this.dialog.open(DialogReportPostComponent, {
      width: '65%',
    });
  }

  copyUrl(): void {
    this.shareEvent.emit(this.postObject.id);
  }
}
