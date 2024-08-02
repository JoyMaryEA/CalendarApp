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
  errorMsg:string | null =null

  constructor(private userInfoService: UserInfoService, private dataservice:DataServiceService) { }

  ngOnInit() {
    let myUID = localStorage.getItem("u_id") as string
    //console.log(myUID);
    this.userInfoService.getUserDaysInPeriod(this.getFirstAndLastDayOfMonth()).subscribe((days) => {this.myDays = days[0].count!; console.log(days)}
    );
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
            backgroundColor:"#"+this.getColorOfEvent(date.end_date.toString() || date.start_date.toString(),"meeee"),
            borderColor:"#"+this.getColorOfEvent(date.end_date.toString() || date.start_date.toString(),"meeee")
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
    //  console.log(this.selectedUsers);
      
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
    var nowDate = new Date()
   if (start<= nowDate) return false;
     return true
    //return start >= this.getDateWithoutTime(new Date());
  }

  getColorOfEvent(end:string,name:string){
    if (new Date(end)<this.today && name=='meeee'){
      return 'a5a5a5' //gray to mean you cannot edit it
    }
    return this.userInfoService.intToRGB(this.userInfoService.hashCode( name))
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
            backgroundColor:"#"+this.getColorOfEvent(date.end_date.toString() || date.start_date.toString(),user.username),
            borderColor:"#"+this.getColorOfEvent(date.end_date.toString() || date.start_date.toString(),user.username)
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
  //  console.log(this.events.filter(event => event.title === 'me').length);
  }
  
  openModal(): void {
    this.showModal = true; 
  }

  isDateAlreadyBooked(info:any){
         // Check if there is an existing event with the title "me"
         for (let event of this.events) {
          const eventStart = new Date(event.start as string);
          const eventEnd = new Date(event.end as string|| event.start as string); // Handle events with no end date
    
          if (event.title === 'me' && ((new Date(info.startStr) >= eventStart && new Date(info.startStr) < eventEnd) || (new Date(info.endStr) > eventStart && new Date(info.endStr) <= eventEnd) || (new Date(info.startStr) < eventStart && new Date(info.endStr) > eventEnd))) {
          
              return true;
          }
      }
      return false
  }
//adds dates
  onModalButtonClick(){
    var info = this.datesSelected;
    this.showModal = false; 

    // Create the newEvent object
    const newEvent: EventInput = {
      title: "me",
      start: info.startStr,
      end: info.endStr || info.startStr
    };

    // Create the officeDays object
    var officeDays: officeDays = {
      start_date: info.startStr,
      end_date: info.endStr || info.startStr
    };

   
    if(!this.isDateAlreadyBooked(info)){
        // Subscribe to addUserOfficeDays
        this.addUser$ = this.userInfoService.addUserOfficeDays(officeDays).subscribe(
          response => {
            //console.log(response);
            
            // Set the newEvent ID from the server response
            newEvent.id = response.newDays!.period_id;

            // Refresh the in-office today data
            this.refreshInOfficeToday();

            // Update the count of days in office for "me"
            this.dataservice.setMyDaysInOffice(
              this.events.filter(event => event.title === 'me').length
            );

            // Get and update the user's days in the current period
            this.userInfoService.getUserDaysInPeriod(this.getFirstAndLastDayOfMonth()).subscribe(
              (days) => { this.myDays = days[0].count!; }
            );

            // Update the events array immutably
            this.events = [
              ...(this.events),
              newEvent
            ];
            this.calendarOptions.events = [
              ...(this.calendarOptions.events as EventInput[]),
              newEvent
            ];
          },
          error => {
            // Handle the error
            // console.log(error.error.error); //to get msg as string
          }
        );
    }else{
      this.errorMsg="You have already booked this date"
      setTimeout(() => {
        this.errorMsg=null
      }, 2000);
    }

  
}


  deleteEvent(info:any){
    if(info.event.title ==='me'){ 
     // console.log(info.event.id);
      const start = new Date(info.event.end); 
      var nowDate = new Date()
      if (start< nowDate){
        this.errorMsg= "Deleting past dates is not allowed"
        setTimeout(() => {
          this.errorMsg=null
        }, 2000);
      }else{
        this.deleteUser$ =this.userInfoService.deleteOfficeDays(info.event.id).subscribe(
          (data)=>{
           console.log(data.message);
            if(data.message){
              const eventIndex = this.events.findIndex(event => event.id == info.event.id);
              // console.log(eventIndex);
               
               if (eventIndex !== -1) {
                 this.events.splice(eventIndex, 1); // Remove 1 element at the found index
                 console.log(this.events);
                    // Update the calendar events
                 this.calendarOptions.events = [...this.events];       
                 this.updateCalendarEvents(this.selectedUsers, this.events)     
                 this.userInfoService.getUserDaysInPeriod(this.getFirstAndLastDayOfMonth()).subscribe((days) => {this.myDays =  days[0].count!; });
                  // Refresh the in-office today data
                 this.refreshInOfficeToday();
               }
            }
        
          
          }
        )
      }
      
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
      // this.userSubscription$.unsubscribe()
      // this.selectedUserSubscription$.unsubscribe()
      // this.deleteUser$.unsubscribe()
      // this.addUser$.unsubscribe()
  }
  getFirstAndLastDayOfMonth(date: Date = new Date()): { start_date: string, end_date: string, u_id: string } {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Pad month with leading zero
  
    const firstDayOfMonth = `${year}-${month}-01`;
    const lastDayOfMonth = new Date(year, date.getMonth() + 1, 0)
                            .toLocaleDateString('en-CA'); // Format as 'YYYY-MM-DD'
    
    const u_id = localStorage.getItem("u_id") as string;
    
    return { start_date: firstDayOfMonth, end_date: lastDayOfMonth, u_id };
}

}
