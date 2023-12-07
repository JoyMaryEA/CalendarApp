import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';
import { IuserLogin } from '../Interfaces';

interface Credentials{
  email:string
  password:string
}
interface SuccessMessages{
  message:string
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
  
}
