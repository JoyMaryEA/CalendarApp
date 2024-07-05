import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser, officeDays } from '../Interfaces';

interface SuccessMessages{
  message:string
}
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  baseURL="http://localhost:4000/" 
  constructor( private http:HttpClient) { }

 
  addUser(user:IUser):Observable<SuccessMessages> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.post<SuccessMessages>(
      this.baseURL+'users',
      user,
      {
        headers
      }
    );
  }
   
  getUsers():Observable<IUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.get<IUser[]>(this.baseURL + 'users', { headers });
  }
  getUsersDays():Observable<IUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.get<IUser[]>(this.baseURL + 'users/days', { headers });
  }
  addUserOfficeDays(officeDays:officeDays):Observable<SuccessMessages> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.post<SuccessMessages>(
      this.baseURL+'users',
      officeDays,
      {
        headers
      }
    );
  }
}
