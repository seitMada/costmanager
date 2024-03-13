import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonRetourTransfertsComponent } from './bon-retour-transferts.component';

describe('BonRetourTransfertsComponent', () => {
  let component: BonRetourTransfertsComponent;
  let fixture: ComponentFixture<BonRetourTransfertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonRetourTransfertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonRetourTransfertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
