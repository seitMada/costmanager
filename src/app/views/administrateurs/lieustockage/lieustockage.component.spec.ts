import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LieustockageComponent } from './lieustockage.component';

describe('LieustockageComponent', () => {
  let component: LieustockageComponent;
  let fixture: ComponentFixture<LieustockageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LieustockageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LieustockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
