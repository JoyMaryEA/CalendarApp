import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IUser } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent implements OnInit{
  buttonText='Staff Summary'
  view: 'summary' | 'officeDays' | 'myOfficeDates' = 'summary';
  constructor(private router:Router, private dataService:DataServiceService){}
  username = localStorage.getItem("username")
  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  }
 
  ngOnInit(): void {
    this.dataService.componentToggle$.subscribe(toggle => {
      this.buttonText = toggle ? 'Staff office days' : 'Staff Summary';
    });
  }
  showStaffSummary() {
    this.view = 'summary';
    this.dataService.setCalendarView()
  }

  showStaffOfficeDays() {
    this.view = 'officeDays';
    this.dataService.setSummaryView()
  }

  showOfficeDates(){
    this.view = 'myOfficeDates';
    this.dataService.setMyOfficeDatesView()
  }
}
