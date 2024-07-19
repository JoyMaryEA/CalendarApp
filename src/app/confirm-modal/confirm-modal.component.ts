import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { confirmModalData } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit{
  @Input() data: confirmModalData | null = null;
  @Output() buttonClicked:EventEmitter<void> = new EventEmitter<void>
  manyDatesSentence:string = "Are you sure you want to book these dates?"
  oneDateSentence:string = "Are you sure you want to book this date?"
  manyDates:string = "Book dates"
  oneDate:string = "Book date"
  noBookedThisDate:number = 0 //default to no bookings
  noMaximumBooked!:number 
  subteam_id = localStorage.getItem("team_id") as string//id of team table:)

  constructor(private userService:UserInfoService, private cdr: ChangeDetectorRef){}
  
  ngOnInit(): void {
      if(this.data!.numberOfDatesSelected<3){// if only one date is selected 
        var selectedDate = this.data?.dateSelected as string
        this.userService.getCountOfUsersByDate(selectedDate).subscribe(
          (count)=>{
            this.noBookedThisDate=count;
            this.cdr.detectChanges()
          }
          
        )
        this.userService.getMaxSeatsBySubteam(this.subteam_id).subscribe((max)=>{
          this.noMaximumBooked=max
          this.cdr.detectChanges()
        })
      }
  }

  closeModal(): void {
   this.data=null
  }

  bookDates():void{
    this.buttonClicked.emit()
    this.data=null
  }
  get progress(): number {
    return (this.noBookedThisDate / this.noMaximumBooked) * 100;
  }
}
