import { Component, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserInfoService } from '../Services/user-info.service';
import { IUser } from '../Interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  standalone:true,
  imports: [FullCalendarModule],
})
export class CalendarComponent implements OnInit {
  users: IUser[] = [];
  calendarOptions!: CalendarOptions;

  constructor(private userInfoService: UserInfoService) { }

  ngOnInit() {
    this.userInfoService.getUsersDays().subscribe(
      (data: IUser[]) => {
        this.users = data;
        console.log(data);
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
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );

    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: true,
      select: this.handleDateSelect.bind(this),
      events: [
        { title: 'Event 1', start: '2024-07-04' },
      ],
      eventClick: (info) => {
        console.log('Event clicked:', info.event);

        const modalContent = `
          <h2>Event Details</h2>
          <p>Title: ${info.event.title}</p>
          <p>Start Date: ${info.event.startStr}</p>
            <p>End Date: ${info.event.endStr}</p>
        `;

        alert(modalContent);

        info.el.style.borderColor = 'red';
      }
    };
   
  }

  handleDateSelect(info: { startStr: string; endStr: string; }) {
    console.log('Selected date:', info.startStr);

    const newEventTitle = prompt('Enter event title:', '');
    if (newEventTitle) {
      const newEvent: EventInput = {
        title: newEventTitle,
        start: info.startStr,
        end: info.endStr || info.startStr
      };

      // Update the events array immutably
      this.calendarOptions.events = [
        ...(this.calendarOptions.events as EventInput[]),
        newEvent
      ];
    }
  }
}
