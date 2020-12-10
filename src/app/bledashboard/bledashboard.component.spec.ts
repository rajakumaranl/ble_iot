import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BLEDashboardComponent } from './bledashboard.component';

describe('BLEDashboardComponent', () => {
  let component: BLEDashboardComponent;
  let fixture: ComponentFixture<BLEDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BLEDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BLEDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
