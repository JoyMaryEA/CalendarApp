import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';

import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

interface User {
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  dates: number[];
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule, ReactiveFormsModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit{
  months:string[] = ['January','February','March', 'April','May','June','July','August','September','October','November','December']
  modalVisible = false;
  startDate: string = '';
  endDate: string = '';
  currDate = new Date
  currMon= this.currDate.getMonth()
  currentMonth: string = this.months[this.currDate.getMonth() ]
  currentYear: number = this.currDate.getFullYear()
   username = ''
  users:User[] =[ {
    name: "John Doe",
    startDate: "2023-10-10",
    endDate: "2023-10-10",
    color: "#336699",
  dates:[10]}]
    faSignOut=faSignOut

    dates :number[][]  = []
   myForm:FormGroup
   
  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      startDate: [''],
      endDate: [''],
    });
  } 
    ngOnInit(){
    this.username = localStorage.getItem("username") as string
    this.dates = this.date2calendar({date:this.currDate})
    this.staffLeaveDays()
    }
  closeModal() {
    this.modalVisible = false;
  }
  openModal(){
    this.modalVisible=true;
  }

  submitForm() {
   this.users.push({name:localStorage.getItem("username")!, startDate:this.myForm.get('startDate')!.value,endDate:this.myForm.get('endDate')!.value,color:this.getRandomLightColor(), dates:[]})
   console.log(this.users);
   this.staffLeaveDays()
   this.myForm.reset();
  this.closeModal();

  }

  nextMonth() {
    const currentMonthIndex = this.currDate.getMonth();
    if (currentMonthIndex === 11) {
      this.currDate.setFullYear(this.currDate.getFullYear() + 1);
      this.currentYear= this.currDate.getFullYear(); 
      this.currDate.setMonth(0); 
    } else {
      this.currDate.setMonth(currentMonthIndex + 1);
    }
    this.currentMonth = this.months[this.currDate.getMonth()];
    const firstDay = new Date(this.currentYear, this.currDate.getMonth(), 1).getDay();
    const lastDay = new Date(this.currentYear, this.currDate.getMonth() +1, 0).getDate();
    const days = 7;
    const weeks = Math.ceil((firstDay + lastDay) / days);
    this.dates= Array.from({ length: weeks }).map((_, week) =>
      Array.from({ length: days }).map((_, day) => {
        const index = week * days + day;
        const dateDay = index - firstDay + 1;
        return dateDay > 0 && dateDay <= lastDay ? dateDay : 0;
      })
    );
  }
  prevMonth(){
   
      const currentMonthIndex = this.currDate.getMonth();
      if (currentMonthIndex === 0) {
        this.currDate.setFullYear(this.currDate.getFullYear() -1);
        this.currentYear= this.currDate.getFullYear(); 
        this.currDate.setMonth(11); 
      } else {
        this.currDate.setMonth(currentMonthIndex -1);
      }
      this.currentMonth = this.months[this.currDate.getMonth()];
      const firstDay = new Date(this.currentYear, this.currDate.getMonth(), 1).getDay();
    const lastDay = new Date(this.currentYear, this.currDate.getMonth() -1, 0).getDate();
    const days = 7;
    const weeks = Math.ceil((firstDay + lastDay) / days);
    this.dates= Array.from({ length: weeks }).map((_, week) =>
      Array.from({ length: days }).map((_, day) => {
        const index = week * days + day;
        const dateDay = index - firstDay + 1;
        return dateDay > 0 && dateDay <= lastDay ? dateDay : 0;
      })
    );
    }
    
   getRandomLightColor() {
    
      const red = Math.floor(Math.random() * 56) + 200;
      const green = Math.floor(Math.random() * 56) + 200; 
      const blue = Math.floor(Math.random() * 56) + 200; 
      const color = `rgb(${red}, ${green}, ${blue})`;
    
      return color;
    }
     date2calendar({ date }: { date: Date }) {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1).getDay();
      const lastDay = new Date(year, month + 1, 0).getDate();
      const days = 7;
      const weeks = Math.ceil((firstDay + lastDay) / days);
    
      return Array.from({ length: weeks }).map((_, week) =>
        Array.from({ length: days }).map((_, day) => {
          const index = week * days + day;
          const dateDay = index - firstDay + 1;
          return dateDay > 0 && dateDay <= lastDay ? dateDay : 0;
        })
      );}
    
      logout(){
        localStorage.clear()
      }
    
      staffLeaveDays(){
        this.users.forEach((user) => {
          const startDate = new Date(user.startDate);
          const endDate = new Date(user.endDate);
          // Create an array of numbers representing the day of the month
          user.dates = Array.from(
            { length: (endDate.getDate() - startDate.getDate() + 1) },
            (_, index) => {
              const date = new Date(startDate);
              date.setDate(startDate.getDate() + index);
              return date.getDate();
            }
          );
        });
        
        console.log(this.users);


      }
      isMatchingMonthAndYear(user: User, date: number): boolean {
        if (user && user.dates && user.startDate && user.endDate) {
          const currentDate = new Date(this.currentYear, this.currMon, date);
          const startDate = new Date(user.startDate);
          const endDate = new Date(user.endDate);
          
          
          return (
            this.currentYear === startDate.getFullYear() &&
            this.currMon === startDate.getMonth() 
            // &&
            // currentDate >= startDate &&
            // currentDate <= endDate
             &&
            user.dates.includes(date)
          );
        }
      
        return false;
      }
      
      
}
