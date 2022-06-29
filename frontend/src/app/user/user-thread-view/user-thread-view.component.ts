import {ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {Thread} from "../../data-access/models/thread";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {DialogEditThreadComponent} from "./dialog-edit-thread/dialog-edit-thread.component";
import {DialogCreatePostComponent} from "./dialog-create-post/dialog-create-post.component";
import {BackendService} from "../../data-access/services/backend.service";
import {Post} from "../../data-access/models/post";
import {DialogDeleteThreadComponent} from "./dialog-delete-thread/dialog-delete-thread.component";
import {DataManagementService} from "../../data-access/services/data-management.service";
import {AuthenticationService} from "../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../data-access/services/difficulty-picker.service";
import {DialogLoginComponent} from "../user-home/dialog/dialog-login/dialog-login.component";
import {BackendCommunicationService} from "../../data-access/services/backend-communication.service";
import {DidAThingServiceService} from "../../shared/did-a-thing/did-a-thing-service.service";
import {ThreadArrayModel} from "../../data-access/models/ThreadArrayModel";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  // threadObject: Thread;
  threadObjectArrayModel: ThreadArrayModel;
  vEnabled: boolean
  content: string = "";
  testcontent: any[];
  editId: number;
  // @ViewChild('content', {static: false}) content: ElementRef;
  // @ViewChild('title', {static: false}) title: ElementRef;
  // @ViewChild('replyBox') replyBox: ElementRef;


  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private backendServiceCom: BackendCommunicationService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private didAThing: DidAThingServiceService) {
  }

  async setVuln() {
    this.vEnabled = this.diffPicker.isEnabledInConfig("/threads/{int}");
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

  ngOnInit(): void {
    this.setVuln();
    this.route.data.subscribe((resp: Data) => {
        console.log(resp["thread"].body)
        this.threadObjectArrayModel = resp["thread"].body;
        console.log(this.threadObjectArrayModel)
        if (this.vEnabled) this.injectContentToDomStartup()
      }
    );
    // this.deserializePost(this.content);
  }

  canEditThread(id: number): boolean {
    if (id == this.authenticate.getCurrentUserId()) return true;
    return false;
  }


  openEditThreadDialog(threadObject: Thread): void {
    const dialogRef = this.dialog.open(DialogEditThreadComponent, {
      width: '65%',
      data: {
        title: threadObject.title,

      },
    });
    dialogRef.afterClosed().subscribe(result => {
      threadObject.title = result.title;
      this.backendServiceCom.putThread(threadObject).subscribe(
        (resp: Data) => {
          let title = resp["body"].title;
          this.threadObjectArrayModel.data.forEach((thread, index) => {
            if (thread.id === threadObject.id) {
              this.threadObjectArrayModel.data[index].title = title;
            }
          });
          if (this.vEnabled) this.injectContentToDom(threadObject)
          if (resp["headers"].get('VulnFound') == "true") {
            console.log("found vuln in userprofile")
            this.didAThing.sendMessage();
          }
        });
    });
  }

  moveToReply(id: number): void {
    // this.replyBox.nativeElement.focus();
    this.changeDetectorRef.detectChanges();
    document.getElementById("replyBox" + id)!.focus();
  }

  openCreateDialog(threadObject: Thread): void {
    if (!this.checkLoggedIn()) return;
    const dialogRef = this.dialog.open(DialogCreatePostComponent, {
      width: '65%',
      data: {
        reply: "",
        content: "",
        showReply: false,
      },
    });
    dialogRef.afterClosed().subscribe(result => {
      threadObject.posts.push(this.backEndService.createPostObject(this.authenticate.getCurrentUserId(), result.content));
    });
  }

  addReply(threadObject: Thread, replyPost: Post): void {
    let selected = window.getSelection();
    let range = selected!.getRangeAt(0);
    let tag = range.commonAncestorContainer;
    console.log(tag.parentNode)
    const box = document.getElementById('replyBox' + threadObject.id)
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
    reply.style.marginLeft = '3%';
    reply.style.width = '80%';
    reply.style.borderLeftWidth = '8px';
    reply.style.borderSpacing = '10px';
    reply.setAttribute('replyPostId', replyPost.id.toString());
    reply.setAttribute('replyUserId', replyPost.author.id.toString());
    reply.setAttribute('replyUserName', replyPost.author.name);
    const replyHeader = document.createElement("p");
    replyHeader.textContent = replyPost.author.name + ":";
    reply.appendChild(replyHeader);
    let stringArray = Array.from(replyPost.content);
    let start = 0;
    for (let i = 0; i < replyPost.content.length; i++) {
      if (stringArray[i] == "/") {
        if (stringArray[i + 1] == "b" && stringArray[i + 2] == "?") {
          let replyLine = document.createElement("div");
          replyLine.textContent = replyPost.content.substring(start, i);
          console.log("Linezeug" + replyLine.textContent)
          reply.appendChild(replyLine)
          i = i + 3;
          start = i;
        } else if (stringArray[i + 1] == "r" && stringArray[i + 2] == "?") {
          for (let j = i + 3; j < replyPost.content.length; j++) {
            if (stringArray[j] == "/" && stringArray[j + 1] == "r") {
              i = j + 1;
              start = i + 1;
              break;
            }
          }
        }
      }
    }
    const above = document.createElement("div");
    const under = document.createElement("div");
    const linebreak = document.createElement("br");
    const linebreak2 = document.createElement("br");
    above.appendChild(linebreak);
    under.appendChild(linebreak2);
    console.log(box!.children[0].textContent);
    if (box!.children[0].textContent == "") {
      box!.appendChild(reply)
    } else {
      tag.parentNode!.insertBefore(reply, tag.nextSibling);
      reply.parentNode!.insertBefore(above, reply);
    }

    box!.appendChild(under);
  }

  createPost(threadObject: Thread): void {
    if (!this.checkLoggedIn()) return;
    let fullReply = document.getElementById('replyBox' + threadObject.id);
    let replyString: string = "";
    for (let i = 0; i < fullReply!.children.length; i++) {
      let child = fullReply!.children[i];
      if (child.children.length != 0 && child.tagName != "BLOCKQUOTE") {
        let rest = "";
        for (let k = 0; k < child.children.length; k++) {
          rest = rest + child.children[k].textContent;
        }
        let test = child.textContent!.replace(rest, "");
        replyString = replyString + test + "/b?";
        for (let j = 0; j < child.children.length; j++) {
          if (child.children[j].tagName == "BLOCKQUOTE") {
            let infos: string = "/a?postId=" + child.children[j].getAttribute('replyPostId')! + "&userId=" + child.children[j].getAttribute('replyUserId') + "&userName=" + child.children[j].getAttribute('replyUserName') + "/a";
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
        console.log("extra")
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
    console.log(replyString);
    console.log("pushed stuff");
    if(replyString == "/b?/b?"){
      return;
    }
    threadObject.posts.push(this.backEndService.createPostObject(this.authenticate.getCurrentUserId(), replyString));
    while (fullReply!.children.length > 0) {
      fullReply!.removeChild(fullReply!.lastChild!);
    }
    let newLine = document.createElement("div");
    let linebreak = document.createElement("br");
    newLine.appendChild(linebreak);
    fullReply!.appendChild(newLine);
  }


  deserializePost(postString: string): void {
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
          replyFull.style.marginLeft = '3%';
          replyFull.style.width = '80%';
          replyFull.style.borderLeftWidth = '8px';
          replyFull.style.borderSpacing = '10px';
          i = i + 13;
          start = i;
          for (let j = i; j < stringArray.length; j++) {
            if (stringArray[j] == "&") {
              replyFull.setAttribute("replyPostId", postString.substring(start, j));
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
    this.testcontent = content;
  }

  currentEdit(post: Post) {
    if (this.editId == post.id) {
      this.editId == null;
    } else {
      this.editId = post.id;
    }
  }

  moveToPost(id: number) {
    window.location.hash = id.toString();
  }

  openDeletePostConsumer(threadObject: Thread, postObjectId: number) {
    console.log(postObjectId)
    this.threadObjectArrayModel.data.forEach((thread, index) => {
      if (thread.id == threadObject.id) {
        for (let z = 0; z < threadObject.posts.length; z++) {
          if (threadObject.posts[z].id == postObjectId) {
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
    let i = threadObject.likedFrom.indexOf(this.authenticate.getCurrentUserId());
    if (i != -1) {
      threadObject.likedFrom.splice(i, 1)
    } else {
      console.log(this.authenticate.getCurrentUserId())
      threadObject.likedFrom.push(this.authenticate.getCurrentUserId());
    }
  }

  copyUrl(postIDd: number): void{
    // geht net richtig weils alten #ref auch mit dazu macht -> weg finden ThreadId zu kriegen
    navigator.clipboard.writeText(window.location.href + "#" + postIDd);
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

  // getUserPicture(userId: number): string | undefined {
  //   return this.backEndService.getUserPicture(userId);
  // }


}
