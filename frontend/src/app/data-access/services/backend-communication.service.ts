import {Injectable} from '@angular/core';
import {Thread} from "../models/thread";
import {Post} from "../models/post";
import {catchError, firstValueFrom, map, NotFoundError, Observable, of, retry, throwError} from "rxjs";
import {UserFull} from "../models/userFull";
import {PostReply} from "../models/postReply";
import {User} from "../models/user";
import {VulnerabilityDifficultyOverview} from "../models/vulnerabilityDifficultyOverview";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {AdminUser, Scoreboard} from "../models/scoreboard";
import {AccessBackend} from "../models/accessBackend";
import {Router} from "@angular/router";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";


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
  getThreadsFromUser(userId: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(this.url + '/user/' + userId + '/threads');
  }

  getPostsFromUser(userId: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.url + '/user/' + userId + '/posts');
  }

  getUser(userId: number): Observable<HttpResponse<UserFull>> {
    return this.httpClient.get<UserFull>(this.url + '/user/' + userId, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorBreadCrumb(error.status.toString())
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getUsers(): Observable<UserFull[]> {
    return this.httpClient.get<UserFull[]>(this.url + '/user')
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
    return this.httpClient.post<UserFull>(this.url + '/user', userPayload);
  }

  putUser(user: UserFull): Observable<UserFull> {
    let userPayload =
      {
        "id": user.id,
        "name": user.name,
        "birth_date": user.birth_date,
        "location": user.location,
        "about": user.about,
        "groups": user.groups,
        "profile_picture": user.profile_picture,
        "profile_comments": user.profile_comments
      };
    // ...user
    return this.httpClient.put<any>(this.url + '/user/' + user.id, userPayload);
  }

  //authenticateUser(password: string):cookie{}


  // For Thread view
  getThread(categoryId: number, threadId: number): Observable<Thread> {
    return this.httpClient.get<Thread>(this.url + '/thread/' + categoryId + '/' + threadId)
      .pipe(catchError((error: Response) => {
        this.errorBreadCrumb(error.status.toString())
        this.router.navigate(['/forum/home']);
        throw {message: 'Bad response', value: error.status}
        // throwError(() => new Error(error.statusText))
      }));
  }

  postThread(categoryId: number, thread: Thread): Observable<Thread> {
    let threadPayload = {...thread};
    return this.httpClient.post<Thread>(this.url + '/thread/' + categoryId, threadPayload);
  }

  postPost(categoryId: number, threadId: number, post: Post): Observable<Post> {
    let postPayload = {...post};
    return this.httpClient.post<Post>(this.url + '/thread/' + categoryId + '/' + threadId, postPayload);
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
  putVulnerabilitiesConfig(vulnerabilities: VulnerabilityDifficultyOverview[]): Observable<VulnerabilityDifficultyOverview[]> {
    let vulnerabilityPayload = {...vulnerabilities};
    return this.httpClient.post<VulnerabilityDifficultyOverview[]>(this.url + '/admin', vulnerabilityPayload);
  }

  postVulnerabilitiesConfig(vulnerabilities: VulnerabilityDifficultyOverview[]): Observable<VulnerabilityDifficultyOverview[]> {
    let vulnerabilityPayload = {...vulnerabilities};
    return this.httpClient.post<VulnerabilityDifficultyOverview[]>(this.url + '/admin', vulnerabilityPayload);
  }

  getVulnerabilitiesConfig(): Observable<VulnerabilityDifficultyOverview[]> {
    return this.httpClient.get<VulnerabilityDifficultyOverview[]>(this.url + '/admin');
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
  getRandomUsers(): UserFull[] {
    let users: UserFull[] = [];
    return users;
  }

  getRandomPosts(): Post[] {
    return [];
  }

  getRandomThreads(): Thread[] {
    return []
  }


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
