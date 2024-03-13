import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonCommandeTransfertsComponent } from './bon-commande-transferts.component';

describe('BonCommandeTransfertsComponent', () => {
  let component: BonCommandeTransfertsComponent;
  let fixture: ComponentFixture<BonCommandeTransfertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonCommandeTransfertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonCommandeTransfertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
