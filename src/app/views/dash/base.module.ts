import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

// CoreUI Modules
// import {
//   AccordionModule,
//   BadgeModule,
//   BreadcrumbModule,
//   ButtonModule,
//   CardModule,
//   CarouselModule,
//   CollapseModule,
//   DropdownModule,
//   FormModule,
//   GridModule,
//   ListGroupModule,
//   NavModule,
//   PaginationModule,
//   PlaceholderModule,
//   PopoverModule,
//   ProgressModule,
//   SharedModule,
//   SpinnerModule,
//   TableModule,
//   TabsModule,
//   TooltipModule,
//   UtilitiesModule
// } from '@coreui/angular';

// import { IconModule } from '@coreui/icons-angular';

// utils
// import { DocsComponentsModule } from '@docs-components/docs-components.module';

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
export class BaseModule {}
