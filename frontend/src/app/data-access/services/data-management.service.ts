import {Injectable} from '@angular/core';
import {Subject} from "rxjs";
import {BackendCommunicationService} from "./backend-communication.service";

@Injectable({
  providedIn: 'root'
})
export class DataManagementService {
  private notifyOthers = new Subject<{ catId: number, threadId: number }>();
  notifyOthersObservable$ = this.notifyOthers.asObservable();

  constructor(private backendCom: BackendCommunicationService) {
  }

  public notifyRest(catId: number, threadId: number) {
    this.backendCom.deleteThread(catId, threadId).subscribe();
    this.notifyOthers.next({catId, threadId});
  }
}
