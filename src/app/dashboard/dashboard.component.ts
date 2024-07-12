import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs';
import { v4 as uid } from 'uuid';
import { UserInfoService } from '../Services/user-info.service';
import { CalendarComponent } from '../calendar/calendar.component';
import { IUser, View } from '../Interfaces';
import { InofficeComponent } from '../inoffice/inoffice.component';
import { UserDashboardComponent } from '../user-dashboard/user-dashboard.component';
import { DataServiceService } from '../Services/data-service.service';
import { StaffSummaryComponent } from '../staff-summary/staff-summary.component';
import { ViewonlyCalendarComponent } from '../viewonly-calendar/viewonly-calendar.component';


interface SuccessMessages{
  message:string
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, CalendarComponent, InofficeComponent, UserDashboardComponent, StaffSummaryComponent, ViewonlyCalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit{
  toggleComponent: View = View.StaffOfficeDays
  u_id= localStorage.getItem('u_id');
 
  constructor(private dataService:DataServiceService) {
 
  
  } 
    ngOnInit(){
    
    this.dataService.componentToggle$.subscribe(toggle => {
      this.toggleComponent = toggle;
    });
    }




  
   getRandomLightColor() {
    
      const red = Math.floor(Math.random() * 56) + 200;
      const green = Math.floor(Math.random() * 56) + 200; 
      const blue = Math.floor(Math.random() * 56) + 200; 
      const color = `rgb(${red}, ${green}, ${blue})`;
    
      return color;
    }
     
    
      logout(){
        localStorage.clear()
        
      }
    
     
    
      refreshPage(){
        window.location.reload();
      }
}
