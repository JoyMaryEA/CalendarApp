import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectUserInputComponent } from './select-user-input.component';

describe('SelectUserInputComponent', () => {
  let component: SelectUserInputComponent;
  let fixture: ComponentFixture<SelectUserInputComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SelectUserInputComponent]
    });
    fixture = TestBed.createComponent(SelectUserInputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
