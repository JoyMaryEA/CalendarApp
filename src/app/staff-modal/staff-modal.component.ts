import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-staff-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './staff-modal.component.html',
  styleUrls: ['./staff-modal.component.css']
})
export class StaffModalComponent {
  @Input() data: any;
 
  closeModal(): void {
    this.data = null; // closes modal because open modal is if (data)
  }
}
