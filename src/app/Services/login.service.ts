import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IuserLogin, SuccessMessages } from '../Interfaces';

interface Credentials{
  email:string
  password:string
}
@Injectable({
  providedIn: 'root'
})


export class LoginService {

  baseURL="http://localhost:4000/" 
  constructor( private http:HttpClient) { }

  login(credentials: Credentials): Observable<IuserLogin> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.post<IuserLogin>(
      this.baseURL + 'login',
      credentials,
      { headers }
    );
  }
  resetPassword(credentials:Credentials): Observable<SuccessMessages>{
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  
    return this.http.put<SuccessMessages>(
      this.baseURL + 'resetpwd',
      credentials,
      { headers }
    );
  }
  
}
