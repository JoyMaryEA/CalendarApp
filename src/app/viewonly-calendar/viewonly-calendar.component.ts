import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CalendarOptions } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserInfoService } from '../Services/user-info.service';
import { officeDays } from '../Interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';

@Component({
  selector: 'app-viewonly-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './viewonly-calendar.component.html',
  styleUrls: ['./viewonly-calendar.component.css']
})
export class ViewonlyCalendarComponent implements OnInit, OnChanges {
  @Input() data!: string | null;
  calendarOptions!: CalendarOptions;

  constructor(private userInfoService: UserInfoService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data) {
      this.fetchUserEvents();
    }
  }

  ngOnInit(): void {
    this.initializeCalendarOptions();
    if (this.data) {
      this.fetchUserEvents();
    }
  }

  fetchUserEvents(): void {
    if (this.data) {
      var team_id=localStorage.getItem("team_id") as string;
      this.userInfoService.getTeamUserDays(team_id).subscribe(
        (data: officeDays[]) => {
          const events = data.map((date) => ({
            title: date.first_name,
            start: date.start_date,
            end: date.end_date,
            allDay: true,
            backgroundColor:"#"+this.userInfoService.intToRGB(this.userInfoService.hashCode(date.first_name as string)),
            borderColor:"#"+this.userInfoService.intToRGB(this.userInfoService.hashCode(date.first_name as string))
          }));
          this.calendarOptions.events = events;
          // To trigger change detection if needed
          this.calendarOptions = { ...this.calendarOptions };
        },
        (error) => {
          console.error('Error fetching user events', error);
        }
      );
    }
  }

  initializeCalendarOptions(): void {
    this.calendarOptions = {
      initialView: 'dayGridMonth',
      plugins: [dayGridPlugin, interactionPlugin],
      selectable: false,
      contentHeight: 'auto',
      events: [],
      // eventClick: (info) => {
      //   const modalContent = `
      //     <p>User: ${info.event.title}</p>
      //     <p>Start Date: ${info.event.startStr}</p>
      //     <p>End Date: ${info.event.endStr}</p>
      //   `;
      //   alert(modalContent);
      // },
      dayMaxEvents:1,
      
    };
  }

   
}
