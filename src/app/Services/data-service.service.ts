import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { selectedUserInputField, View } from '../Interfaces';

@Injectable({
  providedIn: 'root'
})
export class DataServiceService {
  
  private refreshSource = new Subject<void>();
  refresh$ = this.refreshSource.asObservable();
  
  private componentToggleSubject = new BehaviorSubject<View>(View.Summary);
  componentToggle$ = this.componentToggleSubject.asObservable();


  private selectedUsersSubject = new BehaviorSubject<selectedUserInputField[]>([]);
  selectedUsers$ = this.selectedUsersSubject.asObservable();

  private myDaysInOfficeSubject = new BehaviorSubject<number>(0);
  myDaysInOffice$ = this.myDaysInOfficeSubject.asObservable();

  private teamSelectedSubject = new BehaviorSubject<number>(0);
  teamSelected$ = this.teamSelectedSubject.asObservable();

  
  private showModalSubject = new BehaviorSubject<boolean>(false);
  showModal$ = this.showModalSubject.asObservable();
  
  
  triggerRefresh() {
    this.refreshSource.next();
  }
  setCalendarView(){
    this.componentToggleSubject.next(View.StaffOfficeDays);
  }
  setSummaryView(){
    this.componentToggleSubject.next(View.Summary);
  }
  setMyDaysInOffice(days:number){
    this.myDaysInOfficeSubject.next(days);
  }
  setTeamSelected(team_id:number){
    this.myDaysInOfficeSubject.next(team_id);
  }
  setShowModal(show:boolean){
    this.showModalSubject.next(show);
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
