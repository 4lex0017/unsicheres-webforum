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

import {DialogCreatePostComponent} from "../dialog-create-post/dialog-create-post.component";
import {DialogLoginComponent} from "../../user-home/dialog/dialog-login/dialog-login.component";

@Component({
  selector: 'app-reactive-post',
  templateUrl: './reactive-post.component.html',
  styleUrls: ['./reactive-post.component.scss']
})
export class ReactivePostComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef) {
  }


  @Input() postObject: Post;
  @Output() deletePostEvent = new EventEmitter<number>();
  @Output() createPostEvent = new EventEmitter<Post>();
  @Output() moveToPostEvent = new EventEmitter<number>();
  @Output() replyPostEvent = new EventEmitter<Post>();
  @Output() editPostEvent = new EventEmitter<Post>();
  vEnabled: boolean;
  editing: boolean = false;
  contentArray: any[]
  @ViewChild('content', {static: false}) content: ElementRef;


  async setVuln() {
    this.vEnabled = false;
    // = this.diffPicker.isEnabledInConfig("/threads/{int}/posts");
  }

  ngOnInit(): void {
    this.setVuln();
    // this.vEnabled = this.diffPicker.isEnabledInConfig("/threads/{int}/posts");
    this.deserializePost(this.postObject.content);
    if (this.vEnabled) {
      this.changeDetectorRef.detectChanges();
      this.content.nativeElement.replaceChildren();
      this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.postObject.content));
    }
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

  canEditPost(): boolean {
    if (this.postObject.author.id == this.authenticate.getCurrentUserId()) return true;
    return false;
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

  editPost(): void {
    this.editing = true;
    this.editPostEvent.emit(this.postObject);
  }

  addReply(replyPost: Post): void {
    let sel = window.getSelection();
    let ran = sel!.getRangeAt(0);
    let tag = ran.commonAncestorContainer;
    console.log(tag.parentNode)
    const box = document.getElementById('replyBox')
    let inBox = false;

    for (let i = 0; i < box!.children.length; i++) {
      if (tag.parentNode == box?.children[i] || tag.parentNode == box) {
        inBox = true;
      }
    }

    if (!inBox) {
      return;
    }

    const reply = document.createElement("blockquote");
    reply.className = "testReply";
    reply.style.borderRadius = '1px';
    reply.style.border = 'solid #0643b8';
    reply.style.marginLeft = '10%';
    reply.style.width = '80%';
    reply.style.borderLeftWidth = '8px';
    reply.style.borderSpacing = '10px';
    reply.setAttribute('replyPostId', replyPost.id.toString());
    reply.setAttribute('replyUserId', replyPost.author.id.toString());
    reply.setAttribute('replyUserName', replyPost.author.name);
    const replyHeader = document.createElement("p");
    const replyBody = document.createElement("div");
    replyHeader.textContent = replyPost.author.name + ":";
    replyBody.textContent = replyPost.content;
    reply.appendChild(replyHeader);
    reply.appendChild(replyBody);
    const above = document.createElement("div");
    const under = document.createElement("div");
    const linebreak = document.createElement("br");
    const linebreak2 = document.createElement("br");
    above.appendChild(linebreak);
    under.appendChild(linebreak2);
    console.log(box!.children[0].textContent);
    if (box!.children[0].textContent == "") {
      console.log("did it");
      box!.appendChild(reply)
    } else {
      tag.parentNode!.insertBefore(reply, tag.nextSibling);
      reply.parentNode!.insertBefore(above, reply);
    }

    box!.appendChild(under);
  }

  editContent(): void {
    console.log("edit");
    this.editPostEvent.emit(this.postObject);
    let fullReply = document.getElementById('replyBox');
    let replyString: string = "";
    for (let i = 0; i < fullReply!.children.length; i++) {
      let child = fullReply!.children[i];
      if ((child.children.length != 1 && child.tagName != "BLOCKQUOTE") || child.children[0].tagName == "BLOCKQUOTE") {
        let rest = "";
        for (let k = 0; k < child.children.length; k++) {
          rest = rest + child.children[k].textContent;
        }
        let test = child.textContent!.replace(rest, "");
        replyString = replyString + test + "/b?";
        for (let j = 0; j < child.children.length; j++) {
          if (child.children[j].tagName == "BLOCKQUOTE") {
            console.log("idAfterEdit: " + child.children[j].id);
            let infos: string = "/a?postId=" + child.children[j].id + "&userId=" + child.children[j].getAttribute('replyUserId') + "&userName=" + child.children[j].getAttribute('replyUserName') + "/a";
            let header: string = child.children[j].children[0].textContent! + "/b?"
            let body: string = "";
            for (let k = 1; k < child.children[j].children.length; k++) {
              body = body + child.children[j].children[k].textContent! + "/b?"
            }
            replyString = replyString + "/r?" + infos + header + body + "/r";
          } else {
            replyString = replyString + child.children[j].textContent + "/b?";
          }
        }
      } else if (child.tagName == "BLOCKQUOTE") {
        let infos: string = "/a?postId=" + child.getAttribute('replyPostId')! + "&userId=" + child.getAttribute('replyUserId') + "&userName=" + child.getAttribute('replyUserName') + "/a";
        let header: string = child.children[0].textContent! + "/b?"
        let body: string = "";
        for (let k = 1; k < child.children.length; k++) {
          body = body + child.children[k].textContent! + "/b?"
        }
        replyString = replyString + "/r?" + infos + header + body + "/r";
      } else {
        replyString = replyString + child.textContent + "/b?";
      }
    }
    this.editing = false;
    console.log("string")
    console.log(replyString);
    this.postObject.content = replyString;
    this.deserializePost(replyString);
  }

  deserializePost(postString: string): void {
    console.log("Message: " + postString)   //schaun ob Attribute noch da sin
    let stringArray = Array.from(postString);
    let start = 0;
    let content: any[] = new Array(0);
    for (let i = 0; i < stringArray.length; i++) {
      if (stringArray[i] == "/") {
        if (stringArray[i + 1] == "b" && stringArray[i + 2] == "?") {
          let replyLine = document.createElement("div");
          replyLine.textContent = postString.substring(start, i);
          content.push(replyLine);
          i = i + 2;
          start = i + 1;
        } else if (stringArray[i + 1] == "r" && stringArray[i + 2] == "?") {
          let replyFull = document.createElement("blockquote")
          replyFull.className = "testReply";
          replyFull.style.borderRadius = '1px';
          replyFull.style.border = 'solid #0643b8';
          replyFull.style.marginLeft = '10%';
          replyFull.style.width = '80%';
          replyFull.style.borderLeftWidth = '8px';
          replyFull.style.borderSpacing = '10px';
          i = i + 13;
          start = i;
          for (let j = i; j < stringArray.length; j++) {
            if (stringArray[j] == "&") {
              replyFull.setAttribute("replyPostId", postString.substring(start, j));
              replyFull.id = replyFull.getAttribute("replyPostId")!;
              start = j + 8;
              i = start - 1;
              break;
            }
          }
          for (let j = i; j < stringArray.length; j++) {
            if (stringArray[j] == "&") {
              replyFull.setAttribute("replyUserId", postString.substring(start, j))
              start = j + 10;
              i = start
              break;
            }
          }
          for (let j = i; j < stringArray.length; j++) {
            if (stringArray[j] == "/" && stringArray[j + 1] == "a") {
              replyFull.setAttribute("replyUserName", postString.substring(start, j))
              start = j + 2;
              i = start - 1;
              break;
            }
          }
          for (let j = i; j < stringArray.length; j++) {
            if (stringArray[j] == "/" && stringArray[j + 1] == "b") {
              let header = document.createElement("p");
              header.textContent = postString.substring(start, j);
              replyFull.appendChild(header);
              start = j + 3;
              i = start - 1;
              break;
            }
          }
          for (let j = i; j < stringArray.length; j++) {
            if (stringArray[j] == "/") {
              if (stringArray[j + 1] == "b") {
                let line = document.createElement("div");
                line.textContent = postString.substring(start, j);
                replyFull.appendChild(line);
                start = j + 3;
                i = start - 1;
              } else if (stringArray[j + 1] == "r") {
                start = j + 2;
                i = start - 1;
                break;
              }
            }
          }
          content.push(replyFull);
        }
      }
    }
    for (let i = 0; i < content.length; i++) {
      if (content[i].children.length != 0) {
        console.log(content[i].nodeName);
        for (let j = 0; j < content[i].children.length; j++) {
          console.log(content[i].children[j].nodeName);
          console.log(content[i].children[j].textContent)
        }
      } else {
        console.log(content[i].nodeName)
        console.log(content[i].textContent)
      }
    }
    this.contentArray = content;
  }

  isDiv(element: HTMLElement) {
    if (element.nodeName == "DIV") {
      return true;
    }
    return false;
  }

  isP(element: HTMLElement) {
    if (element.nodeName == "P") {
      return true;
    }
    return false;
  }

  isBlock(element: HTMLElement) {
    if (element.nodeName == "BLOCKQUOTE") {
      return true;
    }
    return false;
  }
}
