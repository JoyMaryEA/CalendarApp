import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { LoginService } from '../Services/login.service';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent {
  errorMsg!: string | null
  constructor(private loginService:LoginService, private router:Router){}
  onSubmit(event: Event){
    event.preventDefault()
    const email = document.querySelector("#email") as HTMLInputElement 
    const password = document.querySelector("#password") as HTMLInputElement 
    const cpassword = document.querySelector("#cpassword") as HTMLInputElement 
    if(cpassword.value as string != password.value as string){
      this.errorMsg="Passwords do not match"
      setTimeout(() => {
        this.errorMsg=null
      }, 1000);
      return
    }    
    this.loginService.resetPassword({email:email.value, password:password.value}).subscribe( response => {
      console.log(response.success);
      if(response.success) {
         this.errorMsg="Password reset successful. Taking you back to login.."
        setTimeout(() => {
         this.errorMsg=null;
          this.router.navigate(['/login'])
          //  setTimeout(()=>{
          //   this.errorMsg=null
          //  },1000)
        }, 2000);
       
      }else{
        this.errorMsg="An error occured. Please try again."
        setTimeout(() => {
          this.errorMsg=null
        }, 1000);
      }
      
    },
    error => {
      //console.log(error.error.error); //to get msg as string
      this.errorMsg= error.error.error
      setTimeout(() => {
        this.errorMsg=null
      }, 1000);
    })    
  }
  toLogin(){
    this.router.navigate(["/login"])
  }
  getClass(errorMsg:string){
    if(errorMsg.includes('successful')){
      return "success-color"
    }else return "error-color"
  }
}
