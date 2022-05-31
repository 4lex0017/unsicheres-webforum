import {Injectable} from '@angular/core';
import {Thread} from "../models/thread";
import {Post} from "../models/post";
import {Observable} from "rxjs";
import {UserFull} from "../models/userFull";
import {PostReply} from "../models/postReply";
import {User} from "../models/user";
import {VulnerabilityDifficultyOverview} from "../models/vulnerabilityDifficultyOverview";
import {Category} from "../models/category";
import {HttpClient} from "@angular/common/http";
import {Scoreboard} from "../models/scoreboard";

@Injectable({
  providedIn: 'root'
})
export class BackendCommunicationService {
  readonly url: string = 'http://localhost:4200';

  constructor(private httpClient: HttpClient) {
  }

  //For home
  getCategories(): Observable<Category[]> {
    return this.httpClient.get<Category[]>(this.url + '/home');
  }

  getCategory(categoryId: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(this.url + '/home/' + categoryId);
  }


  //For Userprofile view
  getThreadsFromUser(userId: number): Observable<Thread[]> {
    return this.httpClient.get<Thread[]>(this.url + '/user/' + userId + '/threads');
  }

  getPostsFromUser(userId: number): Observable<Post[]> {
    return this.httpClient.get<Post[]>(this.url + '/user/' + userId + '/posts');
  }

  getUser(userId: number): Observable<UserFull> {
    return this.httpClient.get<UserFull>(this.url + '/user/' + userId);
  }

  getUsers(): Observable<UserFull[]> {
    return this.httpClient.get<UserFull[]>(this.url + '/user');
  }

  postUser(user: UserFull): Observable<UserFull> {
    let userPayload = {...user};
    return this.httpClient.post<UserFull>(this.url + '/user', userPayload);
  }

  putUser(user: UserFull): Observable<UserFull> {
    let userPayload = {...user};
    return this.httpClient.put<UserFull>(this.url + '/user/' + user.id, userPayload);
  }

  //authenticateUser(password: string):cookie{}


  // For Thread view
  getThread(categoryId: number, threadId: number): Observable<Thread> {
    return this.httpClient.get<Thread>(this.url + '/thread/' + categoryId + '/' + threadId);
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

  getScoreboard(): Observable<Scoreboard> {
    return this.httpClient.get<Scoreboard>(this.url + '/admin/scoreboard');
  }


  //Backend
  getUserFromUsername(id: number): User {
    let username = "";
    return {id: id, username: username};
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
