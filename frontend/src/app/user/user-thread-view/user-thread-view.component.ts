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
import {MatSnackBar} from "@angular/material/snack-bar";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {addBodyClass} from "@angular/cdk/schematics";
import {HttpClientModule, HttpResponse} from "@angular/common/http";
import {Observable} from "rxjs";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  // threadObject: Thread;
  threadObjectArrayModel: ThreadArrayModel = {data: []};
  vEnabled: number
  vEnabledPost: number
  vEnabledFrontend: boolean;
  content: string = "";
  testcontent: any[];
  editId: number;
  url: string = "http://localhost:4200/forum";



  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private backendServiceCom: BackendCommunicationService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private didAThing: DidAThingServiceService,
              private _snackBar: MatSnackBar) {
  }

  // async setVuln() {
  //   this.vEnabled = this.diffPicker.isEnabledInConfig("/threads/{int}");
  // }
  async setVuln() {
    await this.backendServiceCom.getVulnerabilitySingle("/threads/{int}").then(value => {
        this.vEnabled = value
        this.vEnabledFrontend = this.isActive();
      }
    );
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
    await this.setVuln();
    this.route.data.subscribe((resp: Data) => {
        //console.log(resp["thread"].body)
        this.threadObjectArrayModel = resp["thread"].body;
        //console.log(this.threadObjectArrayModel)
        if (this.vEnabled != 0) this.injectContentToDomStartup()
      }
    );
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
            //console.log("found vuln in userprofile")
            this.didAThing.sendMessage();
          }
        });
    });
  }

  moveToReply(id: number): void {
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
    //console.log("reply: " + replyPost.content)
    let selected = window.getSelection();
    let range = selected!.getRangeAt(0);
    let tag = range.commonAncestorContainer;
    const box = document.getElementById('replyBox' + threadObject.id)
    /*
    //console.log(tag.parentNode == box!.parentNode);
    if(false){
      //console.log("inside fix")
      let replacement = document.createElement("div");
      replacement.id = "firstline";
      if(box!.children.length != 0){
        box!.insertBefore(replacement, box!.children[0])
      }else{
        box!.appendChild(replacement);
      }
    }
     */


    let inBox = false;

    for (let i = 0; i < box!.children.length; i++) {
      if (tag.parentNode == box?.children[i] || tag.parentNode == box) {
        inBox = true;
      }
    }

    if(box!.children[0] == null){
      inBox = true;
    }

    let editElement;
    if(this.vEnabledFrontend){
      editElement = document.getElementById("loop" + this.editId);
    }else{
      editElement = document.getElementById("replyBox" + this.editId);
    }

    let addedToEdit = false;
    if (editElement != null) {
      for (let i = 0; i < editElement.children.length; i++) {
        if (tag.parentNode!.parentNode == editElement.children[i] || tag.parentNode!.parentNode == editElement || (tag.parentNode == editElement && this.vEnabledFrontend)) {
          addedToEdit = true;
          inBox = true;
        }
      }
    }
    //console.log("inBox: " + inBox);
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
    reply.id = replyPost.id.toString();
    const replyHeader = document.createElement("p");
    replyHeader.textContent = replyPost.author.name + ":";
    reply.appendChild(replyHeader);
    /*
    let stringArray = Array.from(replyPost.content);
    let start = 0;
    for (let i = 0; i < replyPost.content.length; i++) {
      if (stringArray[i] == "/") {
        if (stringArray[i + 1] == "b" && stringArray[i + 2] == "?") {
          let replyLine = document.createElement("div");
          replyLine.textContent = replyPost.content.substring(start, i);
          reply.appendChild(replyLine)
          //console.log("line thats added : " + replyLine.textContent)
          i = i + 3;
          start = i;
        } else if (stringArray[i + 1] == "r" && stringArray[i + 2] == "?") {
          for (let j = i + 3; j < replyPost.content.length; j++) {
            if (stringArray[j] == "/" && stringArray[j + 1] == "r") {
              i = j + 2;
              start = i + 1;
              break;
            }
          }
        }
      }
    }
     */
    let rsplit = replyPost.content.split("/r?");
    let filteredOfReply: string[] = new Array(0);
    for(let i = 0; i < rsplit.length; i++){
      if((Array.from(rsplit[i])[0] + Array.from(rsplit[i])[1]) == '/a'){

      }else{
        //console.log("splitpart: " + rsplit[i])
        filteredOfReply.push(rsplit[i]);
      }
    }
    let filteredOfB: string[] = new Array(0);
    for(let i = 0; i < filteredOfReply.length; i++){
      let firstFilter = filteredOfReply[i].split("/b?");
      for(let j = 0; j < firstFilter.length; j++){
        filteredOfB.push(firstFilter[j])
      }
    }
    for(let i = 0; i < filteredOfB.length; i++){
      let line = document.createElement("div");
      line.textContent = filteredOfB[i];
      reply.appendChild(line);
    }
    const above = document.createElement("div");
    const under = document.createElement("div");
    const linebreak = document.createElement("br");
    const linebreak2 = document.createElement("br");
    above.appendChild(linebreak);
    under.appendChild(linebreak2);
    if(box!.children[0] == null && !addedToEdit){
      //console.log("addcase 0");
      let firsline = document.createElement("div");
      firsline.textContent = box!.textContent;
      box!.textContent = null;
      box!.appendChild(firsline);
      box!.appendChild(above);
      box!.appendChild(reply);
      box!.appendChild(under);
      return;
    }
    if (box!.children[0].textContent == "" && this.editId == -1) {
      //console.log("addcase1")
      box!.appendChild(reply)
    } else {
      if(addedToEdit && !this.vEnabledFrontend){
        tag.parentNode!.insertBefore(under, tag.nextSibling);
      }
      if(addedToEdit && tag.parentNode!.children.length == 1 && !this.vEnabledFrontend){
        //console.log("addcase 3")
        let addBox = document.getElementById("replyBox" + this.editId);
        addBox!.appendChild(above);
        addBox!.appendChild(reply);
      }else if(tag.nextSibling != null) {
        //console.log("addcase 2")
        //console.log(tag)
        tag.parentNode!.insertBefore(reply, tag.nextSibling);
        reply.parentNode!.insertBefore(above, reply);
      }else{
        /*
      }
        if(addedToEdit && !this.vEnabledFrontend){
          //console.log("addcase 3")
          let addBox = document.getElementById("replyBox" + this.editId);
          addBox!.appendChild(above);
          addBox!.appendChild(reply);
        }else{
        */
          //console.log("addcase 4")
          tag.parentNode!.insertBefore(reply, tag.nextSibling);
          reply.parentNode!.insertBefore(above, reply);
          /*
        }
           */
      }
    }
    if(!addedToEdit){
      box!.appendChild(under);
    }
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
            let infos: string = "/a?" + child.children[j].id + "/a?";
            let header: string = child.children[j].children[0].textContent! + "/b?"
            let body: string = "";
            for (let k = 1; k < child.children[j].children.length; k++) {
              body = body + child.children[j].children[k].textContent! + "/b?"
            }
            replyString = replyString + "/r?" + infos + header + body + "/r?";
          } else {
            replyString = replyString + child.children[j].textContent + "/b?";
          }
        }
      } else if (child.tagName == "BLOCKQUOTE") {
        let infos: string = "/a?" + child.id + "/a?";
        let header: string = child.children[0].textContent! + "/b?"
        let body: string = "";
        for (let k = 1; k < child.children.length; k++) {
          body = body + child.children[k].textContent! + "/b?"
        }
        replyString = replyString + "/r?" + infos + header + body + "/r?";
      } else {
        replyString = replyString + child.textContent + "/b?";
      }
    }
    //console.log("pushed stuff: " + replyString);
    if (replyString == "/b?/b?") {
      return;
    }
    while (fullReply!.children.length > 0) {
      fullReply!.removeChild(fullReply!.lastChild!);
    }
    if (fullReply!.textContent != "") {
      replyString = fullReply!.textContent + "/b?" + replyString
    }
    replyString = "/b?" + replyString;
    //console.log("hier")
    if (this.vEnabledPost == 1) replyString = this.diffPicker.frontendFilterTagsNormal(replyString)
    else if (this.vEnabledPost == 2) replyString = this.diffPicker.frontendFilterTagsHard(replyString)
    this.backendServiceCom.postPost(threadObject.id, this.authenticate.getCurrentUserId(), replyString).subscribe((value: Data) => {
      let newPost = value["body"];
      //console.log(newPost);
      threadObject.posts.push(newPost)
      if (value["headers"].get('VulnFound') == "true") {
        //console.log("found vuln in userprofile")
        this.didAThing.sendMessage();
      }
    })
    fullReply!.textContent = "";
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
    this.testcontent = content;
  }

  currentEdit(post: Post) {
    if (this.editId == post.id) {
      this.editId = -1;
    } else {
      this.editId = post.id;
    }
  }

  moveToPost(id: number) {
    window.location.hash = id.toString();
  }

  openDeletePostConsumer(threadObject: Thread, postObjectId: number) {
    //console.log(postObjectId)
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
    this.backendServiceCom.likeThread(threadObject.id).subscribe()
    let i = threadObject.likedFrom.indexOf(this.authenticate.getCurrentUserId());
    if (i != -1) {
      threadObject.likedFrom.splice(i, 1)
    } else {
      //console.log(this.authenticate.getCurrentUserId())
      threadObject.likedFrom.push(this.authenticate.getCurrentUserId());
    }
  }

  copyUrl(postId: number): void {
    let url = window.location.href.split("#")
    navigator.clipboard.writeText(url[0] + "#" + postId);
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      data: "Copied Link"
    })
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
