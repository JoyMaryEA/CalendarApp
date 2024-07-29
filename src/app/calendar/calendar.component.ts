import {  Component, OnDestroy, OnInit, signal, ViewChild } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserInfoService } from '../Services/user-info.service';
import { confirmModalData, IUser, officeDays, selectedUserInputField } from '../Interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DataServiceService } from '../Services/data-service.service';
import { SelectUserInputComponent } from '../select-user-input/select-user-input.component';
import { forkJoin, map, Subscription } from 'rxjs';
import { ConfirmModalComponent } from '../confirm-modal/confirm-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone:true,
  imports: [FullCalendarModule, SelectUserInputComponent, ConfirmModalComponent, CommonModule],
})
export class CalendarComponent implements OnInit, OnDestroy {
  dates: officeDays[] = [];
  calendarOptions!: CalendarOptions;
  selectedUsers: selectedUserInputField[] = [];
  showModal:boolean =false;
  @ViewChild(ConfirmModalComponent) modal!: ConfirmModalComponent;
  datesSelected!: { startStr: string; endStr: string; } 
  confirmModalData!:confirmModalData
  events: EventInput[] = [];
  monthlyData!: { month: string; daysInOffice: number; status: string; }[];
  userSubscription$!:Subscription
  selectedUserSubscription$!:Subscription
  deleteUser$!:Subscription
  addUser$!:Subscription
  today = new Date()
  thisYear = new Date().getFullYear()
  thisMonth = this.today.toLocaleString('default', { month: 'long' });
  myDays!:number

  constructor(private userInfoService: UserInfoService, private dataservice:DataServiceService) { }

  ngOnInit() {
    let myUID = localStorage.getItem("u_id") as string
    //console.log(myUID);
    this.dataservice.myDaysInOffice$.subscribe(days => this.myDays = days);
    this.userSubscription$= this.userInfoService.getOneUserDays(myUID).subscribe(
      (data: IUser[]) => {
        this.dates = data;
      // console.log(data);
       this.calculateMonthlyData()
    
      for (const date of this.dates) {
       
          const newEvent: EventInput = {
            title: "me",
            start: date.start_date.toString(),
            end: date.end_date.toString() || date.start_date.toString(), // Set end date to same as start date by default
            id:date.id,
            allDay: true,
            backgroundColor:"#"+this.userInfoService.intToRGB(this.userInfoService.hashCode("meaee")),
            borderColor:"#"+this.userInfoService.intToRGB(this.userInfoService.hashCode("meaee"))
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
      dayMaxEvents:1,
      select: this.handleDateSelect.bind(this),
      events: [
        { title: 'Event 1', start: '2024-07-04' },
      ],
      eventClick:this.deleteEvent.bind(this),
      visibleRange: {
        start: new Date().toLocaleDateString('en-US', { year: 'numeric' }),
        end: new Date().toLocaleDateString('en-US', { year: 'numeric' }) + '-12-31'
      },

      };
   
      this.selectedUserSubscription$= this.dataservice.selectedUsers$.subscribe(users => {
      this.selectedUsers = users;
      this.updateCalendarEvents(users,this.events);      
      console.log(this.selectedUsers);
      
    });
    
  }
 
   //BUG Big bug, do the insert office days then pick a user, the update is buggy
  selectAllow(selectInfo:any) {
    const start = new Date(selectInfo.start);
    const end = new Date(selectInfo.end);
    
    for (let date = start; date < end; date.setDate(date.getDate() + 1)) {
      if (date.getDay() === 0 || date.getDay() === 6) {
        return false;
      }
      
    }
    var nowDate = new Date()
    if (start<= nowDate) return false;
    //TODO:error message saying this date has passed selecting chances
    return true
    //return start >= this.getDateWithoutTime(new Date());
  }


  handleDateSelect(info: { startStr: string; endStr: string; }) {
    const startDate = new Date(info.startStr);
    const endDate = new Date(info.endStr);
    const timeDifference = endDate.getTime() - startDate.getTime();
    const numberOfDatesSelected = timeDifference / (1000 * 3600 * 24) + 1;
    this.confirmModalData={numberOfDatesSelected,dateSelected:info.startStr}
    this.openModal()
    this.datesSelected=info
    //BUG Big bug:don't allow if event already esists in the same day
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
            backgroundColor:"#"+this.userInfoService.intToRGB(this.userInfoService.hashCode( user.u_id as string)),
            borderColor:"#"+this.userInfoService.intToRGB(this.userInfoService.hashCode( user.u_id as string))
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
    this.dataservice.setMyDaysInOffice(this.events.filter(event => event.title === 'me').length)
    console.log(this.events.filter(event => event.title === 'me').length);
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
    this.addUser$= this.userInfoService.addUserOfficeDays(officeDays).subscribe( response => {
      console.log(response);
      this.refreshInOfficeToday()
      this.dataservice.setMyDaysInOffice(this.events.filter(event => event.title === 'me').length)
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
     // console.log(info.event.id);
      const start = new Date(info.event.start);
      var nowDate = new Date()
      if (start< nowDate){
        alert("can't edit previous dates") //TODO: make into a good error message
      }else{
        this.deleteUser$ =this.userInfoService.deleteOfficeDays(info.event.id).subscribe(
          (data)=>{
          //  console.log(data.message); //TODO: fix this, get the actual message, remove only if delete was successfull
            
          const eventIndex = this.events.findIndex(event => event.id === info.event.id);
          if (eventIndex !== -1) {
            this.events.splice(eventIndex, 1); // Remove 1 element at the found index
            this.updateCalendarEvents(this.selectedUsers, this.events)            
            this.dataservice.setMyDaysInOffice(this.events.filter(event => event.title === 'me').length -1)//cause 1 event is deleted
            
          }
          
          }
        )
      }
      
    }else{
     // alert('not me')
    }
  }

  calculateMonthlyData() {
    if (!this.dates) return;
   
    
    const monthMap = new Map<string, number>();

    this.dates.forEach(({ start_date, end_date }) => {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      const startMonth = startDate.toLocaleString('default', { month: 'long' });
      const endMonth = endDate.toLocaleString('default', { month: 'long' });

      const startMonthKey = `${startMonth} ${startDate.getFullYear()}`;
      const endMonthKey = `${endMonth} ${endDate.getFullYear()}`;

      if (!monthMap.has(startMonthKey)) monthMap.set(startMonthKey, 0);
      if (!monthMap.has(endMonthKey)) monthMap.set(endMonthKey, 0);

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ; //removed adding start day because the end date should be -1
      //BUG: If Ii fix the db enddate to be exact date please add +1 to diffDays calculation
      monthMap.set(startMonthKey, monthMap.get(startMonthKey)! + diffDays);
    });

    this.monthlyData = Array.from(monthMap.entries()).map(([month, daysInOffice]) => ({
      month,
      daysInOffice,
      status: daysInOffice >= 10 ? 'Complete' : 'Incomplete'
    })); 
    var index:number = this.monthlyData.findIndex((element)=>{return element.month==`${this.thisMonth} ${this.thisYear}`;})
    this.dataservice.setMyDaysInOffice(this.monthlyData[index].daysInOffice)
  }
  ngOnDestroy(): void {
    //TODO: How do I do this?
      // this.userSubscription$.unsubscribe()
      // this.selectedUserSubscription$.unsubscribe()
      // this.deleteUser$.unsubscribe()
      // this.addUser$.unsubscribe()
  }
}
