import { Injectable } from '@angular/core';
import {Subject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private notifyOthers = new Subject<string>();
  notifyOthersObservable$ = this.notifyOthers.asObservable();
  constructor() { }
  public notifyRest(query: string){
    this.notifyOthers.next(query);
  }
}
