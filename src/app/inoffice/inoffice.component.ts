import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IUser } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';

@Component({
  selector: 'app-inoffice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inoffice.component.html',
  styleUrls: ['./inoffice.component.css']
})
export class InofficeComponent {
  users!: IUser[];
  constructor(private router:Router,private userInfoService: UserInfoService){}

  ngOnInit() {
    this.userInfoService.getUsers().subscribe(
      (data: IUser[]) => {
        this.users = data;
        console.log(data);
        
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  getAvatarUrl(userName:string): string {
    return `https://robohash.org/${userName}.png?size=50x50`;
  }
}
