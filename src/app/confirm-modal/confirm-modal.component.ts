import { ChangeDetectorRef, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { confirmModalData } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';
import { Observable, combineLatest, map } from 'rxjs';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent implements OnInit {
  @Input() data: confirmModalData | null = null;
  @Output() buttonClicked: EventEmitter<void> = new EventEmitter<void>();
  manyDatesSentence: string = "Are you sure you want to book these dates?";
  oneDateSentence: string = "Are you sure you want to book this date?";
  manyDates: string = "Book dates";
  oneDate: string = "Book date";
  noBookedThisDate$: Observable<number> | null = null;
  noMaximumBooked$: Observable<number> | null = null;
  subteam_id = localStorage.getItem("team_id") as string; // id of team table

  constructor(private userService: UserInfoService) { }

  ngOnInit(): void {
    if (this.data && this.data.numberOfDatesSelected < 3) { // if only one date is selected
      const selectedDate = this.data.dateSelected as string;
      this.noBookedThisDate$ = this.userService.getCountOfUsersByDate(selectedDate);
      this.noMaximumBooked$ = this.userService.getMaxSeatsBySubteam(this.subteam_id);
      
    }
  }

  closeModal(): void {
    this.data = null;
  }

  bookDates(): void {
    this.buttonClicked.emit();
    this.data = null;
  }

  get progress$(): Observable<number> {
    if (!this.noBookedThisDate$ || !this.noMaximumBooked$) {
      return new Observable<number>();
    }

    return combineLatest([this.noBookedThisDate$, this.noMaximumBooked$]).pipe(
      map(([noBookedThisDate, noMaximumBooked]) => {
        if (noMaximumBooked === 0) return 0;
        return (noBookedThisDate / noMaximumBooked) * 100;
      })
    );
  }
}
