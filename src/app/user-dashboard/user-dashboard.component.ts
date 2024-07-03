import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IUser } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';

@Component({
  selector: 'app-user-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.css']
})
export class UserDashboardComponent {

  constructor(private router:Router){}
  logout(){
    localStorage.clear()
    this.router.navigate(['/login']);
  }

}
