import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommandeTransfertsComponent } from './commande-transferts.component';

describe('CommandeTransfertsComponent', () => {
  let component: CommandeTransfertsComponent;
  let fixture: ComponentFixture<CommandeTransfertsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CommandeTransfertsComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CommandeTransfertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
