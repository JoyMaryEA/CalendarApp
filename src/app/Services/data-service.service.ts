import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  private refreshSource = new Subject<void>();
  refresh$ = this.refreshSource.asObservable();
  
  private componentToggleSubject = new BehaviorSubject<boolean>(false);
  componentToggle$ = this.componentToggleSubject.asObservable();

  triggerRefresh() {
    this.refreshSource.next();
  }
  setCalendarView(){
    this.componentToggleSubject.next(true);
  }
  setSummaryView(){
    this.componentToggleSubject.next(false);
  }




}
