import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LoginService } from '../Services/login.service';
import { FormBuilder, FormGroup,  ReactiveFormsModule, Validators } from '@angular/forms';
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
 
  constructor(private loginService:LoginService){}
  getUsername(email:string): string{
    const name= email.split(".")
    console.log(name);
    return name[0]
  }
  onSubmit(event: Event){
    event.preventDefault()
    const email = document.querySelector("#email") as HTMLInputElement 
    const password = document.querySelector("#password") as HTMLInputElement 
    console.log(email.value,password.value);
    this.loginService.login({email:email.value, password:password.value}).subscribe( response => {
      console.log(response);
      console.log(response.success); 
      
      localStorage.setItem("token",response.token)
    },
    error => {
      console.log(error.error.error); //to get msg as string
      
      
    })
    const username = this.getUsername(email.value)
    localStorage.setItem('username',username)
    
  }


}
