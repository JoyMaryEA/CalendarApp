import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';

import { AuthGuard } from './Guards/auth.guard';
import { LoginComponent } from './login/login.component';


const routes:Routes =[
  {path:'', canActivate: [AuthGuard], component:DashboardComponent},
  {path:'login', component:LoginComponent}
]
@NgModule({
  declarations: [],
  imports: [
    CommonModule,RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
