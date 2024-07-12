import { Component, Input, OnChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IUser, officeDays } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';
import { ViewonlyCalendarComponent } from '../viewonly-calendar/viewonly-calendar.component';

@Component({
  selector: 'app-staff-modal',
  standalone: true,
  imports: [CommonModule, ViewonlyCalendarComponent],
  templateUrl: './staff-modal.component.html',
  styleUrls: ['./staff-modal.component.css']
})
export class StaffModalComponent implements OnChanges {
  @Input() data: IUser | null = null;
  userDates: officeDays[] | null = null;
  monthlyData: { month: string, daysInOffice: number, status: string }[] = [];

  constructor(private userInfoService: UserInfoService) {}

  ngOnChanges(): void {
    if (this.data) {
      this.populateModal();
    }
  }

  populateModal() {
    if (this.data) {
      this.userInfoService.getOneUserDays(this.data.u_id).subscribe(
        (data: any) => {
          this.userDates = data;
          this.calculateMonthlyData();
        },
        (error: any) => {
          console.error('Error fetching users', error);
        }
      );
    }
  }

  calculateMonthlyData() {
    if (!this.userDates) return;

    const monthMap = new Map<string, number>();

    this.userDates.forEach(({ start_date, end_date }) => {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      const startMonth = startDate.toLocaleString('default', { month: 'long' });
      const endMonth = endDate.toLocaleString('default', { month: 'long' });

      const startMonthKey = `${startMonth} ${startDate.getFullYear()}`;
      const endMonthKey = `${endMonth} ${endDate.getFullYear()}`;

      if (!monthMap.has(startMonthKey)) monthMap.set(startMonthKey, 0);
      if (!monthMap.has(endMonthKey)) monthMap.set(endMonthKey, 0);

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) ; //removed adding start day because the end date should be -1
      //BUG: If Ii fix the db enddate to be exact date please add +1 to diffDays calculation
      monthMap.set(startMonthKey, monthMap.get(startMonthKey)! + diffDays);
    });

    this.monthlyData = Array.from(monthMap.entries()).map(([month, daysInOffice]) => ({
      month,
      daysInOffice,
      status: daysInOffice >= 10 ? 'Complete' : 'Incomplete'
    }));
  }

  closeModal(): void {
    this.data = null; // closes modal because open modal is if (data)
  }

  getAvatarUrl(userName: string): string {
    return `https://robohash.org/${userName}.png?size=50x50`;
  }
}
