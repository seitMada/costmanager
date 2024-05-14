import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ZonestockageComponent } from './zonestockage.component';

describe('ZonestockageComponent', () => {
  let component: ZonestockageComponent;
  let fixture: ComponentFixture<ZonestockageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ZonestockageComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ZonestockageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
