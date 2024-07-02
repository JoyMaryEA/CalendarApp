import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InofficeComponent } from './inoffice.component';

describe('InofficeComponent', () => {
  let component: InofficeComponent;
  let fixture: ComponentFixture<InofficeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [InofficeComponent]
    });
    fixture = TestBed.createComponent(InofficeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
