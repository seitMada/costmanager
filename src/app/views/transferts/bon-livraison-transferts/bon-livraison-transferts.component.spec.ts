import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonLivraisonTransfertsComponent } from './bon-livraison-transferts.component';

describe('BonLivraisonTransfertsComponent', () => {
  let component: BonLivraisonTransfertsComponent;
  let fixture: ComponentFixture<BonLivraisonTransfertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonLivraisonTransfertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonLivraisonTransfertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
