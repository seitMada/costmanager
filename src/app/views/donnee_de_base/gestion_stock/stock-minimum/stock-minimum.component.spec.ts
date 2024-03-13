import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StockMinimumComponent } from './stock-minimum.component';

describe('StockMinimumComponent', () => {
  let component: StockMinimumComponent;
  let fixture: ComponentFixture<StockMinimumComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StockMinimumComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StockMinimumComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
