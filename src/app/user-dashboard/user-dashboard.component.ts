import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IUser, View } from '../Interfaces';
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
  view: 'summary' | 'officeDays' | 'myOfficeDates' = 'officeDays';
  constructor(private router:Router, private dataService:DataServiceService){}
  username = localStorage.getItem("username")
  role = parseInt(localStorage.getItem("role") as string)
  activeButton: string = 'officeDays'; 

  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  }
 
  ngOnInit(): void {
    this.dataService.componentToggle$.subscribe(toggle => {
      switch (toggle) {
        case View.Summary:
          this.activeButton = 'summary';
          break;
        case View.StaffOfficeDays:
          this.activeButton = 'officeDays';
          break;
        case View.MyOfficeDates:
          this.activeButton = 'myOfficeDates';
          break;
      }
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
  getInitials(str:string) {
    if (!str || typeof str !== 'string') {
      return ''; // Handle invalid input (empty string or non-string)
    }
    const words = str.trim().split(' '); // Trim whitespace and split into words
    return words.length > 0 ? words[0][0].toUpperCase() + (words.length > 1 ? words[1][0].toUpperCase() : '') : '';
  }
  
}
