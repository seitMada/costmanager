import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// // views
import { DashComponent } from "./dash.component";

// Components Routing
import { DashRoutingModule } from './dash-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DashRoutingModule,
    DashComponent
  ],
  declarations: [
    
  ],
})
export class DashModule {}
