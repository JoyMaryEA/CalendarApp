import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Imanager, IUser, officeDays } from '../Interfaces';

interface SuccessMessages{
  newDays: any;
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
  getUserDaysInPeriod(details:{u_id:string,start_date:string,end_date:string}):Observable<IUser[]> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.post<IUser[]>(
      this.baseURL+'users/period',
      {
        u_id:details.u_id,start_date:details.start_date,end_date:details.end_date
      },
      {
        headers
      }
    );
  }
  deleteOfficeDays(id:string){
    const headers  = new HttpHeaders({ 'Content-Type': 'application/json', 'token':localStorage.getItem('token') as string  });
    return this.http.delete<SuccessMessages>(this.baseURL + 'users/'+id,{ headers });
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
    hashCode(str:string) { 
      var hash = 0;
      for (var i = 0; i < str.length; i++) {
         hash = str.charCodeAt(i) + ((hash << 5) - hash);
      }
      return hash;
  } 
  
   intToRGB(i:number){
      var c = (i & 0x00FFFFFF)
          .toString(16)
          .toUpperCase();
      return "00000".substring(0, 6 - c.length) + c;
   }
}
