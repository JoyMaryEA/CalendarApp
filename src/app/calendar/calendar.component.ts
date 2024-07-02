import { Component } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  calendarOptions: CalendarOptions = {
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
      `;

      alert(modalContent);

      info.el.style.borderColor = 'red';
    }
  };

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
