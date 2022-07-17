import {Injectable} from '@angular/core';
import {Thread} from "../models/thread";
import {Post} from "../models/post";
import {catchError, Observable} from "rxjs";
import {UserFull} from "../models/userFull";
import {
  VulnerabilityDifficultyOverviewPackage
} from "../models/vulnerabilityDifficultyOverview";
import {HttpClient, HttpParams, HttpResponse} from "@angular/common/http";
import {AdminUser} from "../models/scoreboard";
import {AccessBackend} from "../models/accessBackend";
import {Router} from "@angular/router";
import {SnackBarNotificationComponent} from "../../shared/snack-bar-notification/snack-bar-notification.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {
  PutConfig,
  PutConfigStates,
  PutConfigStatesDifficulty,
  VulnerabilitiesConfig
} from "../models/vulnerabilitiesConfig";
import {Search} from "../models/search";
import {ThreadsSmallBackendModel} from "../models/threadsSmallBackendModel";
import {PostsSmallBackendModel} from "../models/PostsSmallBackendModel";
import {UserCommentWrapper} from "../models/comment";
import {constant} from "../static/url";
import {CookieService} from "ngx-cookie-service";


@Injectable({
  providedIn: 'root'
})

export class BackendCommunicationService {
  readonly url: string = constant.url;


  constructor(private httpClient: HttpClient,
              private router: Router,
              private _snackBar: MatSnackBar,
              private cookie: CookieService) {
  }


  errorBreadCrumb(text: string): void {
    let fullText = "Sorry, something went wrong. " + text + " Error";
    this.errorBreadCrumbTemplate(fullText);
    this.router.navigate(['/forum/home']);
  }

  errorBreadCrumbTemplate(text: string): void {
    this._snackBar.openFromComponent(SnackBarNotificationComponent, {
      duration: 5000,
      panelClass: ['snack-bar-background'],
      data: text,
    })
  }

  errorManagement(error: Response) {
    let errorResponseString = "";
    switch (error.status) {
      case 409:
        errorResponseString = 'Please login before using the site.'
        this.router.navigate(['/userLogin']);
        break;
      case 204:
        errorResponseString = 'An application breaking sqlInjection was triggered.'
        break;
      case 418:
        errorResponseString = 'The uploaded image datatype is invalid.'
        break;
      case 429:
        errorResponseString = 'Too many requests! Slow down.'
        break;
      case 403:
        errorResponseString = 'Forbidden. Not allowed to access resource.'
        break;
      case 404:
        errorResponseString = 'Content not found!'
        break;
      case 410:
        errorResponseString = 'Your cookie is invalid and has been deleted!'
        this.cookie.delete('tracker');
        this.cookie.delete('tracker', '/');
        this.router.navigate(['/userLogin']);
        break;
      default:
        return;
    }
    this.errorBreadCrumbTemplate(errorResponseString);
  }

  //For home
  getCategories(): Observable<AccessBackend> {
    return this.httpClient.get<AccessBackend>(this.url + '/categories')
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getCategory(categoryId: number): Observable<AccessBackend> {
    return this.httpClient.get<AccessBackend>(this.url + '/categories/' + categoryId)
      .pipe(catchError((error: Response) => {
          // this.errorBreadCrumb(error.status.toString())
          this.errorManagement(error);
          this.router.navigate(['/forum/home']);
          throw {message: 'Bad response', value: error.status}
        })
      );
  }

  getSideContentUsers(): Observable<any> {
    return this.httpClient.get<AccessBackend>(this.url + '/sitecontent/users')
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getSideContentThreads(): Observable<any> {
    return this.httpClient.get<AccessBackend>(this.url + '/sitecontent/threads')
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  //For Userprofile view
  getThreadsFromUser(userId: number): Observable<ThreadsSmallBackendModel> {
    return this.httpClient.get<ThreadsSmallBackendModel>(this.url + '/users/' + userId + '/threads')
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getCommentsFromUser(userId: number): Observable<UserCommentWrapper> {
    return this.httpClient.get<UserCommentWrapper>(this.url + '/profileComments/' + userId)
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getPostsFromUser(userId: number): Observable<PostsSmallBackendModel> {
    return this.httpClient.get<PostsSmallBackendModel>(this.url + '/users/' + userId + '/posts')
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getUser(userId: number): Observable<HttpResponse<UserFull>> {
    return this.httpClient.get<UserFull>('/users/' + userId, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getUsers(): Observable<UserFull[]> {
    return this.httpClient.get<UserFull[]>(this.url + '/users')
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }))
  }

  putUser(userPayload: any): Observable<HttpResponse<UserFull>> {
    return this.httpClient.put<any>(this.url + '/users/' + userPayload.id, userPayload, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  putUserPassword(userId: number, newPassword: string): Observable<HttpResponse<UserFull>> {
    let userPayload = {
      id: userId,
      password: newPassword
    }
    return this.httpClient.put<any>(this.url + '/users/' + userId, userPayload, {
      observe: 'response',
      headers: {"Content-Type": "application/json"}
    })
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  //post comment
  postCommentOnProfile(commentedOnProfileId: number, userId: number, commentContent: string): Observable<HttpResponse<any>> {
    let commentPayload =
      {
        "author": userId,
        "content": commentContent
      };
    return this.httpClient.post<any>(this.url + '/profileComments/' + commentedOnProfileId, commentPayload, {
      observe: 'response',
      headers: {"Content-Type": "application/json"}
    })
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }


  // For Thread view
  getThread(threadId: number): Observable<HttpResponse<Thread>> {
    return this.httpClient.get<Thread>(this.url + '/threads/' + threadId, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  postThread(categoryId: number, threadTitle: string, authorId: number): Observable<HttpResponse<Thread>> {
    let threadPayload = {
      "title": threadTitle,
      "categoryId": categoryId,
      "author": authorId
    };
    return this.httpClient.post<Thread>(this.url + '/categories/' + categoryId + '/threads', threadPayload, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  deleteThread(categoryId: number, threadId: number): Observable<Thread> {
    return this.httpClient.delete<Thread>(this.url + '/categories/' + categoryId + '/threads/' + threadId)
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  putThread(thread: Thread): Observable<HttpResponse<Thread>> {
    let threadPayload =
      {
        "id": thread.id,
        "title": thread.title,
        "categoryId": thread.categoryId
      };
    return this.httpClient.put<Thread>(this.url + '/categories/' + thread.categoryId + '/threads/' + thread.id, threadPayload, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  likeThread(threadId: number): Observable<any> {
    return this.httpClient.put<any>(this.url + '/threads/' + threadId + '/like', {})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }))
  }

  likePost(threadId: number, postId: number): Observable<any> {
    return this.httpClient.put<any>(this.url + '/threads/' + threadId + '/posts/' + postId + '/like', {})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }))
  }

  postPost(threadId: number, author: number, content: string): Observable<HttpResponse<Post>> {
    let postPayload = {
      "threadId": threadId,
      "author": author,
      "content": content
    };
    return this.httpClient.post<Post>(this.url + '/threads/' + threadId + '/posts', postPayload, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  deletePost(threadId: number, postId: number): Observable<Post> {
    return this.httpClient.delete<Post>(this.url + '/threads/' + threadId + '/posts/' + postId)
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  putPost(threadId: number, author: number, postId: number, content: string): Observable<HttpResponse<Post>> {
    let postPayload = {
      "id": postId,
      "threadId": threadId,
      "author": author,
      "content": content
    };
    return this.httpClient.put<Post>(this.url + '/threads/' + threadId + '/posts/' + postId, postPayload, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  setAttackername(name: string): Observable<HttpResponse<any>> {
    let attackerPayload =
      {
        "name": name
      };
    return this.httpClient.post<any>(this.url + '/attacker', attackerPayload, {observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  // Admin
  resetScoreboard(): Observable<any> {
    return this.httpClient.post<any>(this.url + '/admin/reset/scoreboard', null, {
      headers: {admin: "true"}
    })
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }


  resetDatabase(): Observable<any> {
    return this.httpClient.post<any>(this.url + '/admin/reset/db', null, {
      headers: {admin: "true"}
    })
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getVulnerabilities(): Observable<VulnerabilityDifficultyOverviewPackage> {
    return this.httpClient.get<VulnerabilityDifficultyOverviewPackage>(this.url + '/admin/vulnerabilities', {
      headers: {admin: "true"}
    }).pipe(catchError((error: Response) => {
      this.errorManagement(error);
      throw {message: 'Bad response', value: error.status}
    }));
  }

  getVulnerabilitiesConfig(): Observable<VulnerabilitiesConfig> {
    return this.httpClient.get<VulnerabilitiesConfig>(this.url + '/admin/config',
      {headers: {admin: "true"}})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  putVulnerabilitiesConfig(vulnerabilities: VulnerabilityDifficultyOverviewPackage): Observable<VulnerabilitiesConfig> {
    let vulnerabilityPayload: PutConfig = {data: []};
    for (let i = 0; i < vulnerabilities.vulnerabilities.length; i++) {
      let curStateDiff: PutConfigStatesDifficulty = {
        1: vulnerabilities.vulnerabilities[i].subtasks[0].checked,
        2: vulnerabilities.vulnerabilities[i].subtasks[1].checked,
        3: vulnerabilities.vulnerabilities[i].subtasks[2].checked,
      }
      if (vulnerabilities.vulnerabilities[i].subtasks[3]) {
        curStateDiff["4"] = vulnerabilities.vulnerabilities[i].subtasks[3].checked;
      }

      let curState: PutConfigStates = {id: vulnerabilities.vulnerabilities[i].id, difficulty: curStateDiff};
      vulnerabilityPayload.data.push(curState);
    }
    return this.httpClient.put<VulnerabilitiesConfig>(this.url + '/admin/config', vulnerabilityPayload, {headers: {admin: "true"}})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  getScoreboard(): Observable<AdminUser[]> {
    return this.httpClient.get<AdminUser[]>(this.url + '/admin/scoreboard', {headers: {admin: "true"}})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }

  async getVulnerabilitySingle(apiUri: string): Promise<number> {
    const value = await this.httpClient.get<any>(this.url + '/c?r=' + apiUri).toPromise();
    if (value[0].fend_difficulty == 2) return 1;
    else if (value[0].fend_difficulty == 3) return 2;
    else if (value[0].sxss_difficulty < 4 || value[0].fend_difficulty == 1) return 5;
    return 0;
  }

  async getVulnerabilityReflectedSingle(apiUri: string): Promise<number> {
    const value = await this.httpClient.get<any>(this.url + '/c?r=' + apiUri).toPromise();
    if (value[0].rxss_difficulty < 4) return value[0].rxss_difficulty;
    else return 0;
  }

  // Search
  search(search: string, scope: string): Observable<HttpResponse<Search>> {
    let params = new HttpParams().set('q', search)
    let query = '/search'
    switch (scope) {
      case ("users"):
        query = query + '/users'
        break;
      case ("posts"):
        query = query + '/posts'
        break;
      case ("threads"):
        query = query + '/threads'
        break;
      default:
        break;
    }
    return this.httpClient.get<Search>(this.url + query, {params: params, observe: 'response'})
      .pipe(catchError((error: Response) => {
        this.errorManagement(error);
        throw {message: 'Bad response', value: error.status}
      }));
  }


  padTo2Digits(num: number) {
    return num.toString().padStart(2, '0');
  }

  formatDate(dateStr: string): string {
    let date: Date = new Date(dateStr);
    return (
      [
        this.padTo2Digits(date.getDate()),
        this.padTo2Digits(date.getMonth() + 1),
        date.getFullYear(),
      ].join('.'));
  }
}
