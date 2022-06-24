import {Injectable} from '@angular/core';
import {BehaviorSubject, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  private notifyOthers = new Subject<{ catId: number, threadId: number }>();
  notifyOthersObservable$ = this.notifyOthers.asObservable();

  constructor() {
  }

  public notifyRest(catId: number, threadId: number) {
    this.notifyOthers.next({catId, threadId});
  }
}
