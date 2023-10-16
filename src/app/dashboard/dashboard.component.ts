import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { Router, RouterModule } from '@angular/router';


interface User {
  name: string;
  startDate: Date;
  endDate: Date;
  color: string;
  userDates: number[]
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule, ReactiveFormsModule, RouterModule],
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
  users:User[] =[{ name: "joy",
    startDate: new Date(2023,9,1),
    endDate:  new Date(2023,9,7),
    color: 'rgb(217, 249, 200)',
    userDates: [1,2,3,4,5,6,7]} ]
    faSignOut=faSignOut

    dates :number[][]  = []
   myForm:FormGroup
  monthCheck:string =''
  yearCheck:string = ''
  isRequired =false

  constructor(private fb: FormBuilder) {
    this.myForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });
  } 
    ngOnInit(){
    this.username = localStorage.getItem("username") as string
    this.dates = this.date2calendar({date:this.currDate})
    this.staffLeaveDays()
    console.log(this.dates);
    
    }
  closeModal() {
    this.modalVisible = false;
  }
  openModal(){
    this.modalVisible=true;
  }

  submitForm() {
    if(this.myForm.get('startDate')!.value || this.myForm.get('endDate')!.value){
      this.isRequired=false
      this.users.push({name:localStorage.getItem("username")!, startDate:this.stringToDate(this.myForm.get('startDate')!.value),endDate:this.stringToDate(this.myForm.get('endDate')!.value),color:this.getRandomLightColor(), userDates:[]})
      console.log(this.users);
      this.staffLeaveDays()
      this.myForm.reset();
     this.closeModal();
    }
    else {
      this.isRequired=true
      console.log("error");
      
    }

  }
  stringToDate(dateStr:string){
   let dateArr= dateStr.split("-")
   return new Date( parseInt(dateArr[0], 10),parseInt(dateArr[1], 10) - 1,parseInt(dateArr[2], 10))
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
          user.userDates = Array.from(
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
      
}
