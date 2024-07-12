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
  users: IUser[] = [];
  usersToday: IUser[] = [];
  calendarOptions!: CalendarOptions;

  constructor(private userInfoService: UserInfoService, private dataservice:DataServiceService) { }

  ngOnInit() {
    this.userInfoService.getUsersDays().subscribe(
      (data: IUser[]) => {
        this.users = data;
       // console.log(data);
           // Extract events from user data (modify based on your IUser interface)
      const events: EventInput[] = [];
      for (const user of this.users) {
        if (user.start_date && user.first_name) {
          const newEvent: EventInput = {
            title: user.first_name,
            start: user.start_date.toString(),
            end: user.end_date.toString() || user.start_date.toString(), // Set end date to same as start date by default
            allDay: true
          };
          events.push(newEvent); // Push the newly created event object
        }
      }

      this.calendarOptions = {
        events: events
      };
      const today = new Date();
      this.usersToday = data.filter(user => {
        const startDate = new Date(user.start_date);
        const endDate = new Date(user.end_date);
        return today >= startDate && today <= endDate;
      });
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      selectConstraint: {
        daysOfWeek: [1, 2, 3, 4, 5] // allow Monday to Friday (1=Monday, 5=Friday)
      },
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

  handleDateSelect(info: { startStr: string; endStr: string; }) {
    console.log('Selected date:', info.startStr);
    
      const newEventTitle = localStorage.getItem('username')!.split(' ')[0];
      if (newEventTitle) {
        const newEvent: EventInput = {
          title: newEventTitle,
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

  }
  refreshInOfficeToday() {
    this.dataservice.triggerRefresh();
  }
}
