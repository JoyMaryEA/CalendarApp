import { AfterViewInit, Component, ElementRef, OnInit, Renderer2, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StaffModalComponent } from '../staff-modal/staff-modal.component';
import { Imanager, IUser, team } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';
import { DataServiceService } from '../Services/data-service.service';

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
  selectedUser!: IUser[];
  managerTeam:{team_id:number,team_name:string}[]=[]
  team:team[]= [
    { team_id: 4, team_name: 'IS' },
    { team_id: 1, team_name: 'PDM' },
    { team_id: 2, team_name: 'PDA' },
    { team_id: 3, team_name: 'PDL' }
  ];
  selectedTeamId!:number

  constructor(private renderer: Renderer2, private dataService:DataServiceService) {}
 
  ngOnInit(): void {
    var managerLoggedIn:Imanager ={role:parseInt(localStorage.getItem('role') as string), team_id:parseInt(localStorage.getItem('team_id') as string)}
   
    if (managerLoggedIn.role<5){
      this.managerTeam.push(this.team.find((element)=> element.team_id==managerLoggedIn.team_id) as team)
    }else{
      this.managerTeam=this.team
    }
   console.log(this.managerTeam);
   
    
  }
  //TODO: make showModal false
  openModal(team_id:number): void {
    this.dataService.setTeamSelected(team_id);
    this.selectedTeamId=team_id
    this.showModal = true; 
    
  }

  getAvatarUrl(userName:string): string {
    return `https://robohash.org/${userName}.png?size=50x50`;
  }
}
