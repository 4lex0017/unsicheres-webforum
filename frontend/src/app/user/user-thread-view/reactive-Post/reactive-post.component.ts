import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild} from '@angular/core';
import {Post} from "../../../data-access/models/post";
import {DialogEditPostComponent} from "../dialog-edit-post/dialog-edit-post.component";
import {DialogDeletePostComponent} from "../dialog-delete-post/dialog-delete-post.component";
import {ActivatedRoute, Data, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";
import {BackendService} from "../../../data-access/services/backend.service";
import {DataManagementService} from "../../../data-access/services/data-management.service";
import {AuthenticationService} from "../../../data-access/services/authentication.service";
import {DifficultyPickerService} from "../../../data-access/services/difficulty-picker.service";

import {DialogCreatePostComponent} from "../dialog-create-post/dialog-create-post.component";
import {DialogLoginComponent} from "../../user-home/dialog/dialog-login/dialog-login.component";
import {AllowEditService} from "../../../data-access/services/allowEdit.service";
import {DialogReportPostComponent} from "../dialog-report-post/dialog-report-post.component";
import {BackendCommunicationService} from "../../../data-access/services/backend-communication.service";
import {DidAThingServiceService} from "../../../shared/did-a-thing/did-a-thing-service.service";
import {Observable} from "rxjs";


@Component({
  selector: 'app-reactive-post',
  templateUrl: './reactive-post.component.html',
  styleUrls: ['./reactive-post.component.scss']
})
export class ReactivePostComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private dialog: MatDialog,
              private backEndService: BackendService,
              private allowEditService: AllowEditService,
              private router: Router,
              private dataManagement: DataManagementService,
              public authenticate: AuthenticationService,
              private diffPicker: DifficultyPickerService,
              private changeDetectorRef: ChangeDetectorRef,
              private backendServiceCom: BackendCommunicationService,
              private didAThing: DidAThingServiceService) {
  }

  @Input() threadId: number;
  @Input() postObject: Post;
  @Output() deletePostEvent = new EventEmitter<number>();
  @Output() createPostEvent = new EventEmitter<Post>();
  @Output() moveToPostEvent = new EventEmitter<number>();
  @Output() replyPostEvent = new EventEmitter<Post>();
  @Output() editPostEvent = new EventEmitter<Post>();
  @Output() moveToReplyBoxEvent = new EventEmitter;
  @Output() shareEvent = new EventEmitter<number>();
  vEnabled: number
  vEnabledFrontend: boolean;
  editing: boolean = false;
  contentArray: any[]
  url: string = "http://localhost:4200/forum";
  @ViewChild('content', {static: false}) content: ElementRef;


  async setVuln() {
    await this.backendServiceCom.getVulnerabilitySingle("/threads/{int}/posts").then(value => {
        this.vEnabled = value
        this.vEnabledFrontend = this.isActive();
      }
    );
  }

  isActive(): boolean {
    return this.vEnabled != 0;
  }

  async ngOnInit() {
    await this.setVuln();
    if(this.vEnabledFrontend){
      this.deserializePostRegexUnsafe(this.postObject.content)
    }else {
      this.deserializePostRegex(this.postObject.content);
    }
    /*
    this.vEnabledFrontend = true
    this.deserializePostRegexUnsafe(this.postObject.content);
     */
    /*
    if (this.vEnabled != 0) {
      this.changeDetectorRef.detectChanges();
      let content = document.getElementById('content');
      content!.replaceChildren();
      content!.appendChild(document.createRange().createContextualFragment(this.postObject.content));
    }
     */
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
      if(this.vEnabledFrontend){
        let element = document.getElementById("loop" + this.postObject.id)
        element!.contentEditable = "true";
      }
      this.editing = true;
      this.editPostEvent.emit(this.postObject)
    }
  }

  addReply(replyPost: Post): void {
    let sel = window.getSelection();
    let ran = sel!.getRangeAt(0);
    let tag = ran.commonAncestorContainer;
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
    reply.setAttribute('id', replyPost.id.toString());
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
    //console.log(box!.children[0].textContent);
    if (box!.children[0].textContent == "") {
      //console.log("did it");
      box!.appendChild(reply)
    } else {
      tag.parentNode!.insertBefore(reply, tag.nextSibling);
      reply.parentNode!.insertBefore(above, reply);
    }

    box!.appendChild(under);
  }

  editContent(): void {
    //console.log("edit");
    this.editPostEvent.emit(this.postObject);
    let fullReply;
    if(this.vEnabledFrontend){
      fullReply = document.getElementById('loop' + this.postObject.id);
      fullReply.contentEditable = "false";
    }else {
      fullReply = document.getElementById('replyBox' + this.postObject.id);
    }
    //console.log("fullrep: " + fullReply.textContent);
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
            //console.log("idAfterEdit: " + child.children[j].id);
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
        let infos: string = "/a?" + child.getAttribute('id')! + "/a?";
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
    this.editing = false;
    //console.log("editString: " + replyString);

    if (this.vEnabled == 1) this.postObject.content = this.diffPicker.frontendFilterTagsNormal(replyString)
    else if (this.vEnabled == 2) this.postObject.content = this.diffPicker.frontendFilterTagsHard(replyString)
    else this.postObject.content = replyString;
    this.backendServiceCom.putPost(this.threadId,this.postObject.author.id, this.postObject.id,  this.postObject.content).subscribe(
      (value: Data) =>{
        //console.log("nowEdited: ")
        //console.log(value)
        let editedContent = value["body"].content;
        this.postObject.content = editedContent;
        if (value["headers"].get('VulnFound') == "true") {
          //console.log("found vuln in userprofile")
          this.didAThing.sendMessage();
        }
        this.allowEditService.finishEdit();
        this.deserializePostRegex(this.postObject.content);
      }
    )
    // this.postObject.content = replyString;
  }


  deserializePost(postString: string): void {
    //this.deserializePostRegex(postString);
    //console.log("Message: " + postString)   //schaun ob Attribute noch da sin
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
    this.contentArray = content;
  }


  deserializePostRegex(postString: string): void {
    let stringArray = postString.split("/r?");
    for (let i = 0; i < stringArray.length; i++) {
      //console.log("desTest: " + stringArray[i])
    }
    let content: any[] = new Array(0);
    for (let i = 0; i < stringArray.length; i++) {
      if ((Array.from(stringArray[i])[0] + Array.from(stringArray[i])[1]) == '/a') {
        let replyArray = stringArray[i].split("/a?");
        let blockElement = document.createElement("blockquote");
        blockElement.id = replyArray[1];
        let replyContent = replyArray[2].split("/b?");
        let user = document.createElement("p");
        user.textContent = replyContent[0];
        blockElement.appendChild(user);
        for (let j = 1; j < replyContent.length; j++) {
          let divElement = document.createElement("div");
          divElement.textContent = replyContent[j];
          blockElement.appendChild(divElement);
        }
        content.push(blockElement)
      } else {
        let line: string[] = stringArray[i].split("/b?");
        for (let j = 0; j < line.length; j++) {
          let divElement = document.createElement("div");
          divElement.textContent = line[j];
          if (divElement.textContent != "") {
            content.push(divElement);
          }
          //console.log("divEle: " + divElement.textContent)
        }
      }
    }
    this.contentArray = content;
  }

  deserializePostRegexUnsafe(postString: string): void{       //edit noch broken, rest passt
    let stringArray = postString.split("/r?");
    for (let i = 0; i < stringArray.length; i++){
      //console.log("desTest: " + stringArray[i])
    }
    let refElement;
    for(let i = 0; i < stringArray.length; i++){
      if((Array.from(stringArray[i])[0] + Array.from(stringArray[i])[1]) == '/a'){
        let replyArray = stringArray[i].split("/a?");
        refElement = document.getElementById("loop" + this.postObject.id);
        let blockElement = document.createElement("blockquote");  //irgendwie klickbar machen
        blockElement.style.borderRadius = '1px';
        blockElement.style.border = 'solid #0643b8';
        blockElement.style.marginLeft = '3%';
        blockElement.style.width = '80%';
        blockElement.style.borderLeftWidth = '8px';
        blockElement.style.borderSpacing = '10px';
        blockElement.id = this.postObject.id + "blockOf" + replyArray[1];
        refElement!.appendChild(blockElement);
        let blockElementRef = document.getElementById(this.postObject.id + "blockOf" + replyArray[1]);
        let replyContent = replyArray[2].split("/b?");
        //console.log("unsaveContent: " + replyContent[0])
        blockElementRef!.appendChild(document.createRange().createContextualFragment(replyContent[0]));//Username vlt zu p machen statt div? + : nach Username
        blockElementRef!.appendChild(document.createElement("br"))
        for(let j = 1; j < replyContent.length; j++){
          if(replyContent[j] != "") {
            blockElementRef!.appendChild(document.createRange().createContextualFragment(replyContent[j]))
            if(j + 1 != replyContent.length){
              blockElementRef!.appendChild(document.createElement("br"))
            }
          }
        }
      }else{
        let line: string[] = stringArray[i].split("/b?");
        let divElement = document.getElementById("loop" + this.postObject.id);
        let placeHolderDiv;
        let counter: number;
        for(let j = 0; j < line.length; j++){
          //console.log("newContent :" + line[j])
          if(line[j] != "") {
            placeHolderDiv = document.createElement("div")
            placeHolderDiv.id = this.postObject.id + "placeDiv" + j;
            divElement!.appendChild(placeHolderDiv)
            let place = document.getElementById(this.postObject.id + "placeDiv" + j)
            place!.appendChild(document.createRange().createContextualFragment(line[j]))
          }
        }
      }
    }
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

  openReportDialog(): void {
    const dialogRef = this.dialog.open(DialogReportPostComponent, {
      width: '65%',
    });
  }

  copyUrl(): void {
    this.shareEvent.emit(this.postObject.id);
  }
}
