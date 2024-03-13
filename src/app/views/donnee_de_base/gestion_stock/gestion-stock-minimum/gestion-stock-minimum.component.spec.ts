import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GestionStockMinimumComponent } from './gestion-stock-minimum.component';

describe('GestionStockMinimumComponent', () => {
  let component: GestionStockMinimumComponent;
  let fixture: ComponentFixture<GestionStockMinimumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GestionStockMinimumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GestionStockMinimumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
