import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { IUser } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';
import { Subscription } from 'rxjs';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-inoffice',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './inoffice.component.html',
  styleUrls: ['./inoffice.component.css']
})
export class InofficeComponent implements OnInit, OnDestroy{
  users: IUser[]=[]
  constructor(private router:Router,private userInfoService: UserInfoService,private dataService: DataServiceService){}
  currentPun!: string;
  currentDate!: string;
  totalSeats: number = 14;
  data: any;
  private refreshSubscription!: Subscription;
  puns: string[] = [
    "Looks like it's a bit of a desert in here today!",
    "No one's here! It's eerily quiet...",
    "Just you and the tumbleweeds...",
    "So empty, you can hear the echo!",
    "Is it a holiday? It's so deserted!",
    "All quiet on the office front!",
    "It's a ghost town in here!",
    "Looks like everyone's on a secret mission!",
    "The office is taking a nap!",
    "Not a soul in sight, it's like a hidden oasis!",
    "The office is as empty as my inbox on a Friday afternoon!",
    "Did we miss the memo? It's empty in here!",
    "Silence is golden, and it's plentiful today!",
    "Is there a party we weren't invited to?",
    "Empty chairs, empty desks, where did everyone go?",
    "Even the photocopier is lonely today!",
    "Not a creature was stirring, not even a mouse!",
    "Are we in the right place? It's so empty!",
    "Feels like a scene from a western movie!",
    "The silence is deafening today!"
  ];
  ngOnInit() {
   this.loadData()
    this.refreshSubscription = this.dataService.refresh$.subscribe(() => {
      this.loadData();
    });
    this.updatePunMessage();
  }
  ngOnDestroy() {
    if (this.refreshSubscription) {
      this.refreshSubscription.unsubscribe();
    }
  }

  getAvatarUrl(userName:string): string {
    return `https://robohash.org/${userName}.png?size=50x50`;
  }
  loadData() {
    this.userInfoService.getUsersDays().subscribe(
      (data: IUser[]) => {
        
        
        const today = new Date();
        this.users = data.filter(user => {
          const startDate = new Date(user.start_date);
          const endDate = new Date(user.end_date);
          return today >= startDate && today <= endDate;
        });
        //console.log(this.users)
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }
 
  getRandomPun(): string {
    const randomIndex = Math.floor(Math.random() * this.puns.length);
    return this.puns[randomIndex];
  } 
  updatePunMessage() {
    const today = new Date().toDateString();
    if (this.currentDate !== today) {
      this.currentDate = today;
      this.currentPun = this.getRandomPun();
    }
  } 
  get progress(): number {
    return (this.users.length / this.totalSeats) * 100;
  }
}
