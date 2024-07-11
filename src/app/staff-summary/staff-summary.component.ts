import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffModalComponent } from '../staff-modal/staff-modal.component';
import { IUser } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';

@Component({
  selector: 'app-staff-summary',
  standalone: true,
  imports: [CommonModule, StaffModalComponent],
  templateUrl: './staff-summary.component.html',
  styleUrls: ['./staff-summary.component.css'],
})
export class StaffSummaryComponent implements OnInit{
  @ViewChild(StaffModalComponent) modal!: StaffModalComponent;
  @ViewChild('container') cardContainer!: ElementRef;
  users!: IUser[];
  showModal:boolean =false;
  selectedUser!: IUser;

  constructor(private renderer: Renderer2, private userInfoService:UserInfoService) {}
 
  ngOnInit(): void {
   
    this.userInfoService.getUsers().subscribe(
      (data: IUser[]) => {
        this.users = data;
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
    
  }

  openModal(user:IUser): void {
    this.selectedUser = user;
    this.showModal = true; 
  }

  getAvatarUrl(userName:string): string {
    return `https://robohash.org/${userName}.png?size=50x50`;
  }
}
