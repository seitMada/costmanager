import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MercurialesComponent } from './mercuriales.component';

describe('MercurialesComponent', () => {
  let component: MercurialesComponent;
  let fixture: ComponentFixture<MercurialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MercurialesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MercurialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
