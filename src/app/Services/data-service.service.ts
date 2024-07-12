import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { View } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  private refreshSource = new Subject<void>();
  refresh$ = this.refreshSource.asObservable();
  
  private componentToggleSubject = new BehaviorSubject<View>(View.StaffOfficeDays);
  componentToggle$ = this.componentToggleSubject.asObservable();

  triggerRefresh() {
    this.refreshSource.next();
  }
  setCalendarView(){
    this.componentToggleSubject.next(View.StaffOfficeDays);
  }
  setSummaryView(){
    this.componentToggleSubject.next(View.Summary);
  }
  setMyOfficeDatesView(){
    this.componentToggleSubject.next(View.MyOfficeDates);
  }
}
