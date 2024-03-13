import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatriceSaisieComponent } from './matrice-saisie.component';

describe('MatriceSaisieComponent', () => {
  let component: MatriceSaisieComponent;
  let fixture: ComponentFixture<MatriceSaisieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MatriceSaisieComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(MatriceSaisieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
