import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FournisseurModalComponent } from './fournisseur-modal.component';

describe('FournisseurModalComponent', () => {
  let component: FournisseurModalComponent;
  let fixture: ComponentFixture<FournisseurModalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FournisseurModalComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(FournisseurModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
