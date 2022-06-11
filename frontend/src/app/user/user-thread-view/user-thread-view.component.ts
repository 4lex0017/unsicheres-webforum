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
import {insertAfterLastOccurrence} from "@angular/cdk/schematics";

@Component({
  selector: 'app-user-thread-view',
  templateUrl: './user-thread-view.component.html',
  styleUrls: ['./user-thread-view.component.scss']
})
export class UserThreadViewComponent implements OnInit {
  threadObject: Thread;
  vEnabled: boolean
  content: string = "";
  testcontent: any[];
  // @ViewChild('content', {static: false}) content: ElementRef;
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

          // this.content.nativeElement.replaceChildren();
          // this.threadObject.content = this.diffPicker.filterTagsEasy(this.threadObject.content);
          // this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.content));
          this.title.nativeElement.replaceChildren();
          this.title.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.title));
        }
      }
    );
    this.deserializePost(this.content);
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

      },
    });
    dialogRef.afterClosed().subscribe(result => {
      this.threadObject.title = result.title;
      if (this.vEnabled) {
        this.changeDetectorRef.detectChanges();

        // this.content.nativeElement.replaceChildren();
        // this.threadObject.content = this.diffPicker.filterTagsEasy(this.threadObject.content);
        // this.content.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.content));

        this.title.nativeElement.replaceChildren();
        this.title.nativeElement.appendChild(document.createRange().createContextualFragment(this.threadObject.title));
      }

    });
  }

  openCreateDialog(): void {
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
      this.threadObject.posts.push(this.backEndService.createPostObject(this.authenticate.currentUserId, result.content));
    });
  }

  addReply(replyPost: Post): void{
    let sel = window.getSelection();
    let ran = sel!.getRangeAt(0);
    let tag = ran.commonAncestorContainer;
    console.log(tag.parentNode)
    const box = document.getElementById('replyBox')
    let inBox = false;

    for(let i = 0; i < box!.children.length; i++)
    {
      if(tag.parentNode == box?.children[i] || tag.parentNode == box) {
        inBox = true;
      }
    }

    if(!inBox){
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
    reply.setAttribute('replyPostId',replyPost.id.toString());
    reply.setAttribute('replyUserId', replyPost.author.id.toString());
    reply.setAttribute('replyUserName', replyPost.author.username);
    const replyHeader = document.createElement("p");
    const replyBody = document.createElement("div");
    replyHeader.textContent = replyPost.author.username + ":";
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
    if(box!.children[0].textContent == "" ){
      console.log("did it");
      box!.appendChild(reply)
    }else {
      tag.parentNode!.insertBefore(reply, tag.nextSibling);
      reply.parentNode!.insertBefore(above, reply);
    }

    box!.appendChild(under);
  }

  createPost(): void{
    let fullReply = document.getElementById('replyBox');
    let replyString : string = "";
    for(let i = 0; i < fullReply!.children.length; i++){
      let child = fullReply!.children[i];
      if(child.children.length != 0 && child.tagName != "BLOCKQUOTE"){
        let rest = "";
        for(let k = 0; k < child.children.length; k++){
          rest = rest + child.children[k].textContent;
        }
        let test = child.textContent!.replace(rest,"");
        replyString = replyString + test + "/b?";
        for(let j = 0; j < child.children.length; j++) {
          if(child.children[j].tagName == "BLOCKQUOTE") {
            let infos: string = "/a?postId=" + child.children[j].getAttribute('replyPostId')! + "&userId=" + child.children[j].getAttribute('replyUserId') + "&userName=" + child.children[j].getAttribute('replyUserName') + "/a";
            let header: string = child.children[j].children[0].textContent! + "/b?"
            let body: string = "";
            for(let k = 1; k < child.children[j].children.length; k++) {
              body = body + child.children[j].children[k].textContent! + "/b?"
            }
            replyString = replyString + "/r?" + infos + header + body + "/r";
          } else {
            replyString = replyString + child.children[j].textContent + "/b?";
          }
        }
      }else if(child.tagName == "BLOCKQUOTE"){
        console.log("extra")
        let infos: string = "/a?postId=" + child.getAttribute('replyPostId')! + "&userId=" + child.getAttribute('replyUserId') + "&userName=" + child.getAttribute('replyUserName') + "/a";
        let header: string = child.children[0].textContent! + "/b?"
        let body: string = "";
        for(let k = 1; k < child.children.length; k++) {
          body = body + child.children[k].textContent! + "/b?"
        }
        replyString = replyString + "/r?" + infos + header + body + "/r";
      }else{
        replyString = replyString + child.textContent + "/b?";
      }
    }
    console.log(replyString);
    this.threadObject.posts.push(this.backEndService.createPostObject(this.authenticate.currentUserId, replyString));
    while(fullReply!.children.length > 0){
      fullReply!.removeChild(fullReply!.lastChild!);
    }
    let newLine = document.createElement("div");
    let linebreak = document.createElement("br");
    newLine.appendChild(linebreak);
    fullReply!.appendChild(newLine);
  }


  deserializePost(postString: string): void{
    let stringArray = Array.from(postString);
    let start = 0;
    let content: any[] = new Array(0);
    for(let i = 0; i < stringArray.length; i++){
      if(stringArray[i] == "/"){
        if(stringArray[i+1] == "b" && stringArray[i + 2] == "?"){
          let replyLine = document.createElement("div");
          replyLine.textContent = postString.substring(start,i);
          content.push(replyLine);
          i = i + 3;
          start = i;
        }else if(stringArray[i + 1] == "r" && stringArray[i + 2] == "?"){
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
          for(let j = i; j < stringArray.length; j++){
            if(stringArray[j] == "&"){
              replyFull.setAttribute("replyPostId", postString.substring(start, j));
              start = j + 8;
              i = start - 1;
              break;
            }
          }
          for(let j = i; j < stringArray.length; j++) {
            if(stringArray[j] == "&"){
              replyFull.setAttribute("replyUserId", postString.substring(start,j))
              start = j + 10;
              i = start
              break;
            }
          }
          for(let j = i; j < stringArray.length; j++) {
            if(stringArray[j] == "/" && stringArray[j + 1] == "a"){
              replyFull.setAttribute("replyUserName", postString.substring(start, j))
              start = j + 2;
              i = start - 1;
              break;
            }
          }
          for(let j = i; j < stringArray.length; j++){
            if(stringArray[j] == "/" && stringArray[j + 1] == "b"){
              let header = document.createElement("p");
              header.textContent = postString.substring(start, j);
              replyFull.appendChild(header);
              start = j + 3;
              i = start - 1;
              break;
            }
          }
          for(let j = i; j < stringArray.length; j++){
            if(stringArray[j] == "/"){
              if(stringArray[j+1] == "b" ){
                let line = document.createElement("div");
                line.textContent = postString.substring(start,j);
                replyFull.appendChild(line);
                start = j + 3;
                i = start - 1;
              }else if(stringArray[j + 1] == "r"){
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
    for(let i = 0; i < content.length; i++){
      if(content[i].children.length != 0){
        console.log(content[i].nodeName);
        for(let j = 0; j < content[i].children.length; j++){
          console.log(content[i].children[j].nodeName);
          console.log(content[i].children[j].textContent)
        }
      }else{
        console.log(content[i].nodeName)
        console.log(content[i].textContent)
      }
    }
    this.testcontent = content;
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

  // getUserPicture(userId: number): string | undefined {
  //   return this.backEndService.getUserPicture(userId);
  // }


}
