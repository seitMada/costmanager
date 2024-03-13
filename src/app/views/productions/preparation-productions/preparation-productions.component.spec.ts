import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PreparationProductionsComponent } from './preparation-productions.component';

describe('PreparationProductionsComponent', () => {
  let component: PreparationProductionsComponent;
  let fixture: ComponentFixture<PreparationProductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PreparationProductionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PreparationProductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
