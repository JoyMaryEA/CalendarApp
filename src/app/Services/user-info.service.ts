import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IUser } from '../Interfaces';

interface SuccessMessages{
  message:string
}
@Injectable({
  providedIn: 'root'
})
export class UserInfoService {

  baseURL="http://localhost:4000/" 
  constructor( private http:HttpClient) { }

  getAllUsers():Observable<IUser[]>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string });
  
    return this.http.get<IUser[]>(
      this.baseURL+ "users",
      {headers}
      )
  }

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
}
