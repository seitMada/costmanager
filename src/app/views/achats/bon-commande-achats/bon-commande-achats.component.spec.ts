import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonCommandeAchatsComponent } from './bon-commande-achats.component';

describe('BonCommandeAchatsComponent', () => {
  let component: BonCommandeAchatsComponent;
  let fixture: ComponentFixture<BonCommandeAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonCommandeAchatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonCommandeAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
