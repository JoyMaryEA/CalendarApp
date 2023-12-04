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

interface User {
  id:string
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  userDates: number[]
}
interface SuccessMessages{
  message:string
}
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, FormsModule,FontAwesomeModule, ReactiveFormsModule, RouterModule, HttpClientModule, CalendarComponent],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
  changeDetection: ChangeDetectionStrategy.Default,
})
export class DashboardComponent implements OnInit{
  modalVisible = false;
  startDate: string = '';
  endDate: string = '';
   username = ''
  msg:string = ''
   myForm:FormGroup
  isRequired =false

  constructor(private fb: FormBuilder, private http:HttpClient,private userInfoService: UserInfoService) {
    this.myForm = this.fb.group({
      startDate: ['', Validators.required],
      endDate: ['', Validators.required],
    });

  
  } 
    ngOnInit(){
    this.username = localStorage.getItem("username") as string
   
    
    }
  closeModal() {
    this.modalVisible = false;
  }
  openModal(){
    this.modalVisible=true;
  }

  submitForm() {
    if(this.myForm.get('startDate')!.value && this.myForm.get('endDate')!.value){
      this.isRequired=false
     
     this.addUser({id:uid(),name:localStorage.getItem("username")!, startDate:this.myForm.get('startDate')!.value,endDate:this.myForm.get('endDate')!.value,color:this.getRandomLightColor(), userDates:[]}).subscribe((usersData)=>{
      console.log(usersData);
      this.refreshPage()

}

     )
     
      this.myForm.reset();
     this.closeModal();
    
    }
    else {
      this.isRequired=true
      console.log("error");
    }

  }
  addUser(user:User):Observable<SuccessMessages> {
   
    return this.userInfoService.addUser(user)

  }
  stringToDate(dateStr:string){    
   let dateArr= dateStr.split("-")
   return new Date( parseInt(dateArr[0], 10),parseInt(dateArr[1], 10) - 1,parseInt(dateArr[2], 10))
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
