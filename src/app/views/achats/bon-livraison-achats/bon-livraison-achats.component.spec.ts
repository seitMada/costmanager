import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonLivraisonAchatsComponent } from './bon-livraison-achats.component';

describe('BonLivraisonAchatsComponent', () => {
  let component: BonLivraisonAchatsComponent;
  let fixture: ComponentFixture<BonLivraisonAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonLivraisonAchatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonLivraisonAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
