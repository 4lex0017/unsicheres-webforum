import {Injectable} from '@angular/core';
import {Observable, Observer, Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DidAThingServiceService {

  constructor() {
  }

  private subject = new Subject<any>();

  sendMessage() {
    this.subject.next(true);
  }


  onMessage(): Observable<any> {
    return this.subject.asObservable();
  }
}
