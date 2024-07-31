import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// // views
import { DashComponent } from "./dash.component";

// Components Routing
import { DashRoutingModule } from './dash-routing.module';
import { NgbModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  imports: [
    CommonModule,
    DashRoutingModule,
    DashComponent,
    NgbModule,
    NgbTooltipModule,
  ],
  declarations: [
    
  ],
})
export class DashModule {}
