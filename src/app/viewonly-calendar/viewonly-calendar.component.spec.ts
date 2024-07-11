import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewonlyCalendarComponent } from './viewonly-calendar.component';

describe('ViewonlyCalendarComponent', () => {
  let component: ViewonlyCalendarComponent;
  let fixture: ComponentFixture<ViewonlyCalendarComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [ViewonlyCalendarComponent]
    });
    fixture = TestBed.createComponent(ViewonlyCalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
