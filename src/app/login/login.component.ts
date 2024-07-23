import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Route, Router, RouterModule } from '@angular/router';
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
  errorMsg!: string | null
  constructor(private loginService:LoginService, private router:Router){}
  onSubmit(event: Event){
    event.preventDefault()
    const email = document.querySelector("#email") as HTMLInputElement 
    const password = document.querySelector("#password") as HTMLInputElement 

    
    this.loginService.login({email:email.value, password:password.value}).subscribe( response => {
      console.log(response.success); 
      this.errorMsg=null
      localStorage.setItem("token",response.token)
      localStorage.setItem("u_id",response.u_id)
      localStorage.setItem("role",response.role)
      localStorage.setItem("team_id",response.team_id)
      localStorage.setItem('username',response.first_name + ' '+ response.last_name)
      this.router.navigate(['/'])
    },
    error => {
      //console.log(error.error.error); //to get msg as string
      this.errorMsg= 'Invalid username or password'
      setTimeout(() => {
        this.errorMsg=null
      }, 1000);
    })    
  }
  resetPass(){
    this.router.navigate(["/resetpass"])
  }

}
