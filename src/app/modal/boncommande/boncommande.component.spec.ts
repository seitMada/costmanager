import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoncommandeComponent } from './boncommande.component';

describe('BoncommandeComponent', () => {
  let component: BoncommandeComponent;
  let fixture: ComponentFixture<BoncommandeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BoncommandeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BoncommandeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
