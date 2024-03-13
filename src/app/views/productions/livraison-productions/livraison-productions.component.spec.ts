import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LivraisonProductionsComponent } from './livraison-productions.component';

describe('LivraisonProductionsComponent', () => {
  let component: LivraisonProductionsComponent;
  let fixture: ComponentFixture<LivraisonProductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LivraisonProductionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(LivraisonProductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
