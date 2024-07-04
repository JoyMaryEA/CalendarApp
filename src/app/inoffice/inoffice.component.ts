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
  currentPun!: string;
  currentDate!: string;
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
    this.userInfoService.getUsers().subscribe(
      (data: IUser[]) => {
        this.users = data;
        console.log(data);
        
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
    
    this.updatePunMessage();
  }

  getAvatarUrl(userName:string): string {
    return `https://robohash.org/${userName}.png?size=50x50`;
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
}
