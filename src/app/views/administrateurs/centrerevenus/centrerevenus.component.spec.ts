import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CentrerevenusComponent } from './centrerevenus.component';

describe('CentrerevenusComponent', () => {
  let component: CentrerevenusComponent;
  let fixture: ComponentFixture<CentrerevenusComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CentrerevenusComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CentrerevenusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
