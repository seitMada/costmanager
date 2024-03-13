import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SimulationAchatsComponent } from './simulation-achats.component';

describe('SimulationAchatsComponent', () => {
  let component: SimulationAchatsComponent;
  let fixture: ComponentFixture<SimulationAchatsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SimulationAchatsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SimulationAchatsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
