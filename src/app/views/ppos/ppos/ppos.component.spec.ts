import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PposComponent } from './ppos.component';

describe('PposComponent', () => {
  let component: PposComponent;
  let fixture: ComponentFixture<PposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
