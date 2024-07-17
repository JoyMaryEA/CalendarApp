import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserInfoService } from '../Services/user-info.service';
import { IUser, officeDays } from '../Interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone:true,
  imports: [FullCalendarModule],
})
export class CalendarComponent implements OnInit {
  dates: officeDays[] = [];
  calendarOptions!: CalendarOptions;

  constructor(private userInfoService: UserInfoService, private dataservice:DataServiceService) { }

  ngOnInit() {
    let myUID = localStorage.getItem("u_id") as string
    //console.log(myUID);
    
    this.userInfoService.getOneUserDays(myUID).subscribe(
      (data: IUser[]) => {
        this.dates = data;
       // console.log(data);
       
      const events: EventInput[] = [];
      for (const date of this.dates) {
       
          const newEvent: EventInput = {
            title: "me",
            start: date.start_date.toString(),
            end: date.end_date.toString() || date.start_date.toString(), // Set end date to same as start date by default
            allDay: true,
          }
        events.push(newEvent); // Push the newly created event object
      }

      this.calendarOptions = {
        events: events
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
      eventClick: (info) => {
        console.log('Event clicked:', info.event);

        const modalContent = `
          <p>User: ${info.event.title}</p>
          <p>Start Date: ${info.event.startStr}</p>
            <p>End Date: ${info.event.endStr}</p> 
        `;

        alert(modalContent);

       
      }
    };
   
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
    console.log('Selected date:', info.startStr);
   
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

  refreshInOfficeToday() {
    this.dataservice.triggerRefresh();
  }
}
