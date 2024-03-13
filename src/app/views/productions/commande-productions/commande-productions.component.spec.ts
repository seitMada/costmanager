import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeProductionsComponent } from './commande-productions.component';

describe('CommandeProductionsComponent', () => {
  let component: CommandeProductionsComponent;
  let fixture: ComponentFixture<CommandeProductionsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeProductionsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeProductionsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
