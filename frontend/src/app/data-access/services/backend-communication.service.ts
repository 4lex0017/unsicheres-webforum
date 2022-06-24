import {Injectable} from '@angular/core';
import {Thread} from "../models/thread";
import {Post} from "../models/post";
import {catchError, firstValueFrom, map, NotFoundError, Observable, of, retry, throwError} from "rxjs";
import {UserFull} from "../models/userFull";
import {PostReply} from "../models/postReply";
import {User} from "../models/user";
import {

  VulnerabilityDifficultyOverviewPackage
} from "../models/vulnerabilityDifficultyOverview";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {AdminUser} from "../models/scoreboard";
import {AccessBackend} from "../models/accessBackend";
import {Data, Router} from "@angular/router";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  PutConfig,
  PutConfigStates,
  PutConfigStatesDifficulty,
  VulnerabilitiesConfig
} from "../models/vulnerabilitiesConfig";
import {VulnerabilityDifficultyPicker} from "../models/vulnerabilityDifficultyPicker";
import {Search} from "../models/search";
import {ThreadsSmallBackendModel} from "../models/threadsSmallBackendModel";
import {UserFullBackend} from "../models/userFullBackendModel";


@Injectable({
  providedIn: 'root'
})

export class BackendCommunicationService {
  readonly url: string = 'http://localhost:80';


  constructor(private httpClient: HttpClient, private router: Router, private _snackBar: MatSnackBar) {
  }

  errorBreadCrumb(text: string): void {
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      data: "Sorry, something went wrong. " + text + " Error",
    })
    this.router.navigate(['/forum/home']);
  }

  //For home
  getCategories(): Observable<AccessBackend> {
    return this.httpClient.get<AccessBackend>(this.url + '/categories');
  }

  getCategory(categoryId: number): Observable<AccessBackend> {
    return this.httpClient.get<AccessBackend>(this.url + '/categories/' + categoryId)
      .pipe(catchError((error: Response) => {
          this.errorBreadCrumb(error.status.toString())
          this.router.navigate(['/forum/home']);
          throw {message: 'Bad response', value: error.status}
        })
      );
  }


  //For Userprofile view
  getThreadsFromUser(userId: number): Observable<ThreadsSmallBackendModel> {
    return this.httpClient.get<ThreadsSmallBackendModel>(this.url + '/users/' + userId + '/threads');
  }

  getPostsFromUser(userId: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.url + '/users/' + userId + '/posts');
  }

  getUser(userId: number): Observable<HttpResponse<UserFull>> {
    return this.httpClient.get<UserFull>(this.url + '/users/' + userId, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorBreadCrumb(error.status.toString())
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getUsers(): Observable<UserFull[]> {
    return this.httpClient.get<UserFull[]>(this.url + '/users')
  }

  postUser(user: any): Observable<any> {
    // let userPayload = {
    //   "name": user.name,
    //   "password": user.password,
    //   "birth_date": user.birth_date,
    //   "location": user.location,
    //   "about": user.about,
    //   "groups": user.groups,
    //   "profile_picture": user.profile_picture,
    //   "profile_comments": user.profile_comments
    // };
    let userPayload = {...user}
    // ...user
    return this.httpClient.post<UserFull>(this.url + '/users', userPayload);
  }

  putUser(user: UserFullBackend): Observable<HttpResponse<UserFull>> {
    let userPayload =
      {
        "id": user.id,
        "name": user.name,
        "birth_date": user.birthDate,
        "location": user.location,
        "about": user.about,
        "groups": user.groups,
        "profile_picture": user.profilePicture,
        "profile_comments": user.profileComments
      };
    // ...user
    return this.httpClient.put<any>(this.url + '/users/' + user.id, userPayload, {observe: 'response'});
  }

  //authenticateUser(password: string):cookie{}


  // For Thread view
  getThread(threadId: number): Observable<HttpResponse<Thread>> {
    return this.httpClient.get<Thread>(this.url + '/threads/' + threadId, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorBreadCrumb(error.status.toString())
        throw {message: 'Bad response', value: error.status}
      }));
  }

  // getUser(userId: number): Observable<HttpResponse<UserFull>> {
  //   return this.httpClient.get<UserFull>(this.url + '/users/' + userId, {observe: 'response'})
  //     .pipe(catchError((error: Response) => {
  //       this.errorBreadCrumb(error.status.toString())
  //       throw {message: 'Bad response', value: error.status}
  //     }));
  // }
  postThread(categoryId: number, thread: Thread): Observable<HttpResponse<Thread>> {
    let threadPayload = {
      "title": thread.title,
      "author": thread.author.id
    };
    return this.httpClient.post<Thread>(this.url + '/categories/' + categoryId + '/threads', threadPayload, {observe: 'response'});
  }

  deleteThread(categoryId: number, threadId: number): Observable<Thread> {
    return this.httpClient.delete<Thread>(this.url + '/categories/' + categoryId + '/threads/' + threadId);
  }

  putThread(thread: Thread): Observable<HttpResponse<Thread>> {
    let threadPayload =
      {
        "id": thread.id,
        "title": thread.title
      };
    // let threadPayload = {...thread};
    return this.httpClient.put<Thread>(this.url + '/categories/' + thread.categoryId + '/threads/' + thread.id, threadPayload, {observe: 'response'});
  }

  postPost(categoryId: number, threadId: number, post: Post): Observable<HttpResponse<Post>> {
    let postPayload = {...post};
    return this.httpClient.post<Post>(this.url + '/thread/' + categoryId + '/' + threadId, postPayload, {observe: 'response'});
  }

  deletePost(threadId: number, postId: number): Observable<Post> {
    return this.httpClient.delete<Post>(this.url + '/threads/' + threadId + '/posts/' + postId);
  }

  putPost(threadId: number, post: Post): Observable<Post> {
    let postPayload = {...post};
    return this.httpClient.put<Post>(this.url + '/threads/' + threadId + '/posts/' + post.id, postPayload);
  }

  createPostObject(userId: number, content: string, repliedTo?: PostReply): Post {
    throw new Error();
    // -> postPost()
  }

  createThreadObject(userId: number, title: string, content: string,): Thread {
    throw new Error();
    // -> postThread()
  }

  getSearchThreadResult(searchQuery: string): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(this.url + '/thread/search/' + searchQuery);
  }


  //For Admin

  getVulnerabilities(): Observable<VulnerabilityDifficultyOverviewPackage> {
    return this.httpClient.get<VulnerabilityDifficultyOverviewPackage>(this.url + '/admin');
  }

  getVulnerabilitiesConfig(): Observable<VulnerabilitiesConfig> {
    return this.httpClient.get<VulnerabilitiesConfig>(this.url + '/admin/config');
  }

  putVulnerabilitiesConfig(vulnerabilities: VulnerabilityDifficultyOverviewPackage): Observable<VulnerabilitiesConfig> {
    let vulnerabilityPayload: PutConfig = {data: []};
    console.log(vulnerabilities.vulnerabilities)
    for (let i = 0; i < vulnerabilities.vulnerabilities.length; i++) {
      let curStateDiff: PutConfigStatesDifficulty = {
        1: vulnerabilities.vulnerabilities[i].subtasks[0].checked,
        2: vulnerabilities.vulnerabilities[i].subtasks[1].checked,
        3: vulnerabilities.vulnerabilities[i].subtasks[2].checked,
        4: vulnerabilities.vulnerabilities[i].subtasks[3].checked,
      }
      let curState: PutConfigStates = {id: vulnerabilities.vulnerabilities[i].id, difficulty: curStateDiff};
      vulnerabilityPayload.data.push(curState);
    }
    console.log(vulnerabilityPayload)
    return this.httpClient.put<VulnerabilitiesConfig>(this.url + '/admin/config', vulnerabilityPayload);
  }


  getScoreboard(): Observable<AdminUser[]> {
    return this.httpClient.get<AdminUser[]>(this.url + '/admin/scoreboard');
  }


  //Backend
  getUserFromUsername(id: number): User {
    let username = "";
    return {id: id, name: username};
  }

  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(): string {
    let date: Date = new Date();
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('.'));

  }


  //For search & Userprofile view
  getCategoryStrFromThreadId(id: number): string {
    return "";
  }

  getThreadSlugFromPostId(id: number): string {
    return "";
  }

  getSlugFromTitle(title: string) {
    return title.replace(/\s+/g, '-').toLowerCase();
  }


  //Fake search result

  search(search: string): Observable<HttpResponse<Search>> {
    let params = new HttpParams().set('q', search)
    return this.httpClient.get<Search>(this.url + '/search', {params: params, observe: 'response'});
  }

  // getRandomUsers(): UserFull[] {
  //   let users: UserFull[] = [];
  //   return users;
  // }
  //
  // getRandomPosts(): Post[] {
  //   return [];
  // }
  //
  // getRandomThreads(): Thread[] {
  //   return []
  // }


  //Fake authentication
  checkRegisterUserExists(username: string): boolean {
    return false;
  }

  checkLoginData(username: string, password: string): number {
    return -1;
  }

  getLoginId(username: string, password: string): number {
    return -1;
  }

  registerNewUser(userName: string, userPassword: string): void {
  }

  // getFullUserFromUserId(id: number): UserFull { //needed for small user -> User conversion
  //   return {
  //     id: -1,
  //     username: "dummy",
  //     joined: "",
  //     about: "",
  //     role: [],
  //     comments: [
  //       {
  //         id: -2,
  //         content: "",
  //         userId: -1
  //       }
  //     ],
  //   }
  // }
}
