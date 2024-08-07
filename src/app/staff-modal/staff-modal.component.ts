// staff-modal.component.ts
import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Imanager, IUser, officeDays } from '../Interfaces';
import { UserInfoService } from '../Services/user-info.service';
import { ViewonlyCalendarComponent } from '../viewonly-calendar/viewonly-calendar.component';
import { FormsModule } from '@angular/forms';
import { DataServiceService } from '../Services/data-service.service';

@Component({
  selector: 'app-staff-modal',
  standalone: true,
  imports: [CommonModule, FormsModule, ViewonlyCalendarComponent],
  templateUrl: './staff-modal.component.html',
  styleUrls: ['./staff-modal.component.css']
})
export class StaffModalComponent implements OnInit {
  @Input() data: number | null = null;
  userDates: officeDays[] | null = null;
  monthlyData: any[] = [];
  selectedYear: number = 2024;
  selectedMonth: string = 'JAN';
  showModal = true;
  team_id!: number;
  details: { username: string, days: number, u_id: string, status: string }[] = [];
  monthMap = new Map<string, Map<string, { username: string, days: number }>>();
  currentDate: Date;
  currentMonthLabel!: string;

  constructor(private userInfoService: UserInfoService, private dataService: DataServiceService) {
    this.currentDate = new Date();
    this.updateMonthLabel();
  }

  ngOnInit(): void {
    this.dataService.teamSelected$.subscribe(
      (data) => {
        this.team_id = data;
        this.fetchTeamUserDays(data as unknown as string);
      },
      (error) => {
        console.error('Error subscribing to teamSelected$', error);
      }
    );
    this.fetchDataForMonth(this.currentDate);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && this.data !== null) {
      this.fetchTeamUserDays(this.data.toString());
    }
  }

  fetchTeamUserDays(team_id: string) {
    const managerLoggedIn: Imanager = { role: parseInt(localStorage.getItem('role') as string), team_id: parseInt(team_id) };
    this.userDates = [];
    this.monthMap.clear();
    this.monthlyData = [];
    this.userInfoService.getStaffSummaryData(managerLoggedIn).subscribe(
      (data: IUser[]) => {
        this.userDates = data;
        this.calculateMonthlyData();
        this.fetchDataForMonth(this.currentDate);
      },
      (error: any) => {
        console.error('Error fetching users', error);
      }
    );
  }

  calculateMonthlyData() {
    if (!this.userDates) return;
    this.userDates.forEach(({ start_date, end_date, first_name, last_name, u_id }) => {
      const startDate = new Date(start_date);
      const endDate = new Date(end_date);

      const startMonth = startDate.toLocaleString('default', { month: 'long' });
      const endMonth = endDate.toLocaleString('default', { month: 'long' });

      const startMonthKey = `${startMonth} ${startDate.getFullYear()}`;
      const endMonthKey = `${endMonth} ${endDate.getFullYear()}`;

      const username = `${first_name} ${last_name}`;

      if (!this.monthMap.has(startMonthKey)) this.monthMap.set(startMonthKey, new Map());
      if (!this.monthMap.has(endMonthKey)) this.monthMap.set(endMonthKey, new Map());

      const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

      if (!this.monthMap.get(startMonthKey)!.has(u_id as string)) {
        this.monthMap.get(startMonthKey)!.set(u_id as string, { username, days: 0 });
      }
      if (!this.monthMap.get(endMonthKey)!.has(u_id as string)) {
        this.monthMap.get(endMonthKey)!.set(u_id as string, { username, days: 0 });
      }

      this.monthMap.get(startMonthKey)!.get(u_id as string)!.days += diffDays;
    });

    this.monthlyData = Array.from(this.monthMap.entries()).flatMap(([month, userMap]) => 
      Array.from(userMap.entries()).map(([u_id, { username, days }]) => ({
        month,
        username,
        days,
        status: days >= 10 ? 'Complete' : 'Incomplete'
      }))
    );
  }

  onSubmit() {
    this.details = this.getDetailsByMonthYear(this.getMonthName(this.selectedMonth), this.selectedYear);
    this.currentMonthLabel=this.getMonthName(this.selectedMonth)+ " " + this.selectedYear
  }

  getDetailsByMonthYear(month: string, year: number): { username: string, days: number, u_id: string, status: string }[] {
    const monthKey = `${month} ${year}`;
    const details: { username: string, days: number, u_id: string, status: string }[] = [];

    if (this.monthMap.has(monthKey)) {
      this.monthMap.get(monthKey)!.forEach(({ username, days }, u_id) => {
        const status = days >= 10 ? 'Complete' : 'Incomplete';
        details.push({ username, days, u_id, status });
      });
    } else {
      console.error(`No data found for ${monthKey}`);
    }

    return details;
  }

  getMonthName(shortMonth: string): string {
    const monthNames: { [key: string]: string } = {
      'JAN': 'January',
      'FEB': 'February',
      'MAR': 'March',
      'APR': 'April',
      'MAY': 'May',
      'JUN': 'June',
      'JUL': 'July',
      'AUG': 'August',
      'SEP': 'September',
      'OCT': 'October',
      'NOV': 'November',
      'DEC': 'December',
    };
    return monthNames[shortMonth] || '';
  }

  closeModal(): void {
    this.data = null;
    this.dataService.setShowModal(false);
  }

  navigateMonth(direction: number): void {
    this.currentDate.setMonth(this.currentDate.getMonth() + direction);
    this.updateMonthLabel();
    this.fetchDataForMonth(this.currentDate);
  }

  updateMonthLabel(): void {
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long' };
    this.currentMonthLabel = this.currentDate.toLocaleDateString('en-US', options);
  }

  fetchDataForMonth(date: Date): void {
    const month = date.getMonth() + 1; // getMonth() is zero-based
    const year = date.getFullYear();
    const longMonth = new Intl.DateTimeFormat('en-US', { month: 'long' }).format(date);

    this.details = this.getDetailsByMonthYear(longMonth, year);
  }
}
