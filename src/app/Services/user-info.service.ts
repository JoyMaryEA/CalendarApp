import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Imanager, IUser, officeDays } from '../Interfaces';

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
  getOneUserDays(u_id:string):Observable<IUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.get<IUser[]>(this.baseURL + 'users/days/'+u_id, { headers });
  }
  getTeamUserDays(team_id:string):Observable<IUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.get<IUser[]>(this.baseURL + 'users/days/team/'+team_id, { headers });
  }
  getStaffSummaryData(manager:Imanager):Observable<IUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.post<IUser[]>(this.baseURL + 'users/juniors', manager,{ headers });
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


//administrative methods, calls from adminRoutes
    getCountOfUsersByDate(date:string):Observable<number> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
      return this.http.post<number>(
        this.baseURL+'adm/dates',
        {date},
        {
          headers
        }
      );
    }

    getMaxSeatsBySubteam(subteam_id:string):Observable<number> {
      const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
      return this.http.get<number>(
        this.baseURL+'adm/max/'+subteam_id,
        {
          headers
        }
      );
    }
}
