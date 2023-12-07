import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {  FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { faSignOut } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { RouterModule } from '@angular/router';
import {HttpClient, HttpClientModule} from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserInfoService } from '../Services/user-info.service';
import { IUser } from '../Interfaces';


@Component({
  selector: 'app-calendar',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule, ReactiveFormsModule, RouterModule, HttpClientModule],
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent {
  months:string[] = ['January','February','March', 'April','May','June','July','August','September','October','November','December']
  modalVisible = false;
  startDate: string = '';
  endDate: string = '';
  currDate = new Date
  currMon= this.currDate.getMonth()
  currentMonth: string = this.months[this.currDate.getMonth() ]
  currentYear: number = this.currDate.getFullYear()
   username = ''
  users$:Observable<IUser[]> 
  users: IUser[] = []

    dates :number[][]  = []
  
  monthCheck:string =''
  yearCheck:string = ''
  isRequired =false

  constructor(private http:HttpClient,private userInfoService: UserInfoService) {
  

    this.users$=  this.userInfoService.getAllUsers()
    this.users$.subscribe((usersData)=>{
      console.log(usersData);
      this.users = usersData
      this.staffLeaveDays()

})
  } 
    ngOnInit(){
    this.username = localStorage.getItem("username") as string
    this.dates = this.date2calendar({date:this.currDate})
 
 
  
    console.log(this.dates);
    
    }
  closeModal() {
    this.modalVisible = false;
  }
  openModal(){
    this.modalVisible=true;
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
    this.monthCalculations()
  }
  monthCalculations(){
    this.currentMonth = this.months[this.currDate.getMonth()];
    const firstDay = new Date(this.currentYear, this.currDate.getMonth() , 1).getDay();
  const lastDay = new Date(this.currentYear, this.currDate.getMonth() + 1, 0).getDate();
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
     this.monthCalculations()
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
      console.log(this.users);
      
      this.users.forEach((user) => {
        const startDate = new Date(this.stringToDate(user.start_date));
        const endDate = new Date(this.stringToDate(user.end_date));
    
        if (!isNaN(startDate.getTime()) && !isNaN(endDate.getTime())) {
           
            user.userDates = [];
    
            while (startDate <= endDate) {
                const currentDate = new Date(startDate);
                user.userDates.push(currentDate.getDate());
                startDate.setDate(startDate.getDate() + 1);
            }
    
            console.log(user.userDates);
        } else {
            console.error(`Invalid date for user: ${user.email}`);
        }
    });
    
       
        console.log(this.users);
      }
      monthYearCheck(userStartDate:string,userEndDate:string, userDates:number[], oneDate:number){
        
        let startDate = this.stringToDate(userStartDate)
        let endDate = this.stringToDate(userEndDate)
        const splitArrays = userDates.reduce<number[][]>((result, num) => {
          if (num === 1) {
            result.push([]);
          }
          if (result.length) {
            result[result.length - 1].push(num);
          }
          return result;
        }, [[]]);
      //  console.log(splitArrays);
        
        if (!splitArrays){
          if ( startDate.getFullYear() === this.currDate.getFullYear() && startDate.getMonth()===this.currDate.getMonth() ){
            return true
          }
          else return false
        } else{
          //check if idea on using splitArrays and getMonth+ index value is feasible for months more than 2
          if (startDate.getFullYear() === this.currDate.getFullYear() && startDate.getMonth()===this.currDate.getMonth() && splitArrays[0].includes(oneDate)  ){
            return true
          } else if (startDate.getFullYear() === this.currDate.getFullYear() &&endDate.getMonth()===this.currDate.getMonth() && splitArrays[1].includes(oneDate) ){
            return true
          } else return false
        }
      }  
      refreshPage(){
        window.location.reload();
      }
}

