import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SuiviTransfertComponent } from './suivi-transfert.component';

describe('SuiviTransfertComponent', () => {
  let component: SuiviTransfertComponent;
  let fixture: ComponentFixture<SuiviTransfertComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SuiviTransfertComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SuiviTransfertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
