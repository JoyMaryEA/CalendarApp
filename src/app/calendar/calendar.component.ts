import {  Component, OnInit, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserInfoService } from '../Services/user-info.service';
import { confirmModalData, IUser, officeDays, selectedUserInputField } from '../Interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DataServiceService } from '../Services/data-service.service';
import { SelectUserInputComponent } from '../select-user-input/select-user-input.component';
import { forkJoin, map } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone:true,
  imports: [FullCalendarModule, SelectUserInputComponent, ConfirmModalComponent, CommonModule],
})
export class CalendarComponent implements OnInit {
  dates: officeDays[] = [];
  calendarOptions!: CalendarOptions;
  selectedUsers: selectedUserInputField[] = [];
  showModal:boolean =false;
  @ViewChild(ConfirmModalComponent) modal!: ConfirmModalComponent;
  datesSelected!: { startStr: string; endStr: string; } 
  confirmModalData!:confirmModalData
  events: EventInput[] = [];

  constructor(private userInfoService: UserInfoService, private dataservice:DataServiceService) { }

  ngOnInit() {
    let myUID = localStorage.getItem("u_id") as string
    //console.log(myUID);
   
    this.userInfoService.getOneUserDays(myUID).subscribe(
      (data: IUser[]) => {
        this.dates = data;
       // console.log(data);
       
    
      for (const date of this.dates) {
       
          const newEvent: EventInput = {
            title: "me",
            start: date.start_date.toString(),
            end: date.end_date.toString() || date.start_date.toString(), // Set end date to same as start date by default
            id:date.id,
            allDay: true,
          }
        this.events.push(newEvent); // Push the newly created event object
      }

      this.calendarOptions = {
        events: this.events
      };
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      weekends:true,
      selectAllow: this.selectAllow,
      contentHeight: 'auto', 
      dayMaxEventRows: true,
      select: this.handleDateSelect.bind(this),
      events: [
        { title: 'Event 1', start: '2024-07-04' },
      ],
      eventClick:this.deleteEvent.bind(this)
        };
   
    this.dataservice.selectedUsers$.subscribe(users => {
      this.selectedUsers = users;
      this.updateCalendarEvents(users,this.events);      
      console.log(this.selectedUsers);
      
    });
    
  }

  selectAllow(selectInfo:any) {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);

    for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return false;
      }
      
    }
    return true;
  }

  handleDateSelect(info: { startStr: string; endStr: string; }) {
    const startDate = new Date(info.startStr);
    const endDate = new Date(info.endStr);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const numberOfDatesSelected = timeDifference / (1000 * 3600 * 24) + 1;
    this.confirmModalData={numberOfDatesSelected,dateSelected:info.startStr}
    this.openModal()
    this.datesSelected=info
   
  }

  refreshInOfficeToday() {
    this.dataservice.triggerRefresh();
  }
  updateCalendarEvents(users: selectedUserInputField[],eventss:any) {
    const events: EventInput[] = [...eventss];//eventss is the current loged in user

    if (users.length === 0) {
      // If no users, update the calendar options with an empty events array
      this.calendarOptions = {
        ...this.calendarOptions,
        events: events
      };
      return;
    }

    const observables = users.map(user =>
      this.userInfoService.getOneUserDays(user.u_id).pipe(
        map((dates: IUser[]) => {
          const userEvents = dates.map(date => ({
            title: user.username.split(" ", 1)[0],
            start: date.start_date.toString(),
            end: date.end_date.toString() || date.start_date.toString(),
            allDay: true,
          }));
          return userEvents;
        })
      )
    );
  
    // Combine events from all users
    forkJoin(observables).subscribe(userEventsArray => {
     
      userEventsArray.forEach(userEvents => {
        events.push(...userEvents);
      });
  
      // Update calendar options after all events are added
      this.calendarOptions = {
        ...this.calendarOptions,
        events: [...events] // Ensure immutability, to detect change and update
      };
  
    });
    
  }
  
  openModal(): void {
    this.showModal = true; 
  }

  onModalButtonClick(){
    var info = this.datesSelected;
    this.showModal = false; 
    const newEvent: EventInput = {
      title: "me",
      start: info.startStr,
      end: info.endStr || info.startStr
    };
    var officeDays:officeDays ={
      start_date: info.startStr,
      end_date:info.endStr || info.startStr
    }
    this.userInfoService.addUserOfficeDays(officeDays).subscribe( response => {
      console.log(response);
      this.refreshInOfficeToday()
    },
    error => {
      console.log(error.error.error); //to get msg as string
      
      
    })
    // Update the events array immutably
    this.calendarOptions.events = [
      ...(this.calendarOptions.events as EventInput[]),
      newEvent
    ];
  
  }

  deleteEvent(info:any){
    if(info.event.title ==='me'){ //TODO:change to add check in token to confirm if it is your day
      console.log(info.event.id);
      
      this.userInfoService.deleteOfficeDays(info.event.id).subscribe(
        (data)=>{
        //  console.log(data.message); //TODO: fix this, get the actual message, remove only if delete was successfull
          
        const eventIndex = this.events.findIndex(event => event.id === info.event.id);
        if (eventIndex !== -1) {
          this.events.splice(eventIndex, 1); // Remove 1 element at the found index
          this.updateCalendarEvents(this.selectedUsers, this.events)
        }
        }
      )
    }else{
      alert('not me')
    }
  }
}
