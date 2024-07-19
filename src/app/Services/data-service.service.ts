import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { selectedUserInputField, View } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  private refreshSource = new Subject<void>();
  refresh$ = this.refreshSource.asObservable();
  
  private componentToggleSubject = new BehaviorSubject<View>(View.StaffOfficeDays);
  componentToggle$ = this.componentToggleSubject.asObservable();


  private selectedUsersSubject = new BehaviorSubject<selectedUserInputField[]>([]);
  selectedUsers$ = this.selectedUsersSubject.asObservable();
  
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

  setSelectedUsers(users: selectedUserInputField[]): void {
    this.selectedUsersSubject.next(users);
  }

  getSelectedUsers(): selectedUserInputField[] {
    return this.selectedUsersSubject.getValue();
  }
  addUser(user: selectedUserInputField): void {
    const currentUsers = this.selectedUsersSubject.getValue();
     this.selectedUsersSubject.next(currentUsers); //TODO:figure out when this changes
  }

  removeUser(u_id: string): void {
    const currentUsers = this.selectedUsersSubject.getValue();
    this.selectedUsersSubject.next(currentUsers.filter(user => user.u_id !== u_id));   
  }
}
