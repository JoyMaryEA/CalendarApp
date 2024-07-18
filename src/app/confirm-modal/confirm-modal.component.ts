import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-confirm-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './confirm-modal.component.html',
  styleUrls: ['./confirm-modal.component.css']
})
export class ConfirmModalComponent {
  @Input() data: number | null = null;
  @Output() buttonClicked:EventEmitter<void> = new EventEmitter<void>
  manyDatesSentence:string = "Are you sure you want to book these dates?"
  oneDateSentence:string = "Are you sure you want to book this date?"
  manyDates:string = "Book dates"
  oneDate:string = "Book date"
  closeModal(): void {
   this.data=null
  }

  bookDates():void{
    this.buttonClicked.emit()
    this.data=null
  }
}
