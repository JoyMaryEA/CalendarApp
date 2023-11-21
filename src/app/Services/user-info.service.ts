import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
interface User {
  id:string
  name: string;
  startDate: string;
  endDate: string;
  color: string;
  userDates: number[]
}

@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  baseURL="http://localhost:3000/" 
  constructor( private http:HttpClient) { }

  getAllUsers():Observable<User[]>{
    return this.http.get<User[]>(this.baseURL+ "users")
  }

  //addUser()
}
