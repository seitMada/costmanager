import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreationInventairesComponent } from './creation-inventaires.component';

describe('CreationInventairesComponent', () => {
  let component: CreationInventairesComponent;
  let fixture: ComponentFixture<CreationInventairesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreationInventairesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CreationInventairesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
