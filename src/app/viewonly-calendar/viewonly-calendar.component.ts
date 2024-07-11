import { Component, Input, OnInit } from '@angular/core';
import { CalendarOptions, EventInput } from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import { UserInfoService } from '../Services/user-info.service';
import { IUser, officeDays } from '../Interfaces';
import { FullCalendarModule } from '@fullcalendar/angular';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-viewonly-calendar',
  standalone: true,
  imports: [FullCalendarModule],
  templateUrl: './viewonly-calendar.component.html',
  styleUrls: ['./viewonly-calendar.component.css']
})
export class ViewonlyCalendarComponent {
  @Input() data! :officeDays[] | null
  calendarOptions!: CalendarOptions;
  userEvents: any

  constructor() {     this.calendarOptions = {
    initialView: 'dayGridMonth',
    plugins: [dayGridPlugin, interactionPlugin],
    selectable: true,
    events: this.userEvents,
    eventClick: (info) => {
      console.log('Event clicked:', info.event);

      const modalContent = `
        <p>User: ${info.event.title}</p>
        <p>Start Date: ${info.event.startStr}</p>
          <p>End Date: ${info.event.endStr}</p>
      `;

      alert(modalContent);
     
  },
 
} }

  ngOnInit() {
    console.log(this.data);
    if(this.data){
     this.userEvents= this.data!.map((oneEvent)=>{
      return {
        title:'',
        start:oneEvent.start_date,
        end:oneEvent.end_date
      }
     })
  }
}
  
}
