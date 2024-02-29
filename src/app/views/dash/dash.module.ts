import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// // views
import { DashComponent } from "./dash/dash.component";

// Components Routing
import { BaseRoutingModule } from './dash-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BaseRoutingModule,
    DashComponent
  ],
  declarations: [
    
  ],
})
export class BaseModule {}
