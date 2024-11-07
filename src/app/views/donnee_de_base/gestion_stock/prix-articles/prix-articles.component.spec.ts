import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PrixArticlesComponent } from './prix-articles.component';

describe('PrixArticlesComponent', () => {
  let component: PrixArticlesComponent;
  let fixture: ComponentFixture<PrixArticlesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PrixArticlesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PrixArticlesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
