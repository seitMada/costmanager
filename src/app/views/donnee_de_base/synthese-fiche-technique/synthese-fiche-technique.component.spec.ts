import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SyntheseFicheTechniqueComponent } from './synthese-fiche-technique.component';

describe('SyntheseFicheTechniqueComponent', () => {
  let component: SyntheseFicheTechniqueComponent;
  let fixture: ComponentFixture<SyntheseFicheTechniqueComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SyntheseFicheTechniqueComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SyntheseFicheTechniqueComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
