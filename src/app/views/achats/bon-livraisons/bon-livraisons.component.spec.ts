import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BonLivraisonsComponent } from './bon-livraisons.component';

describe('BonLivraisonsComponent', () => {
  let component: BonLivraisonsComponent;
  let fixture: ComponentFixture<BonLivraisonsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BonLivraisonsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BonLivraisonsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
