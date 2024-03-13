import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SynthesePposComponent } from './synthese-ppos.component';

describe('SynthesePposComponent', () => {
  let component: SynthesePposComponent;
  let fixture: ComponentFixture<SynthesePposComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SynthesePposComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SynthesePposComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
