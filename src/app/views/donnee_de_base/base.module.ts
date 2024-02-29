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
import { ArticlesComponent } from "./articles/articles.component";

// Components Routing
import { BaseRoutingModule } from './base-routing.module';

@NgModule({
  imports: [
    CommonModule,
    BaseRoutingModule,
    ArticlesComponent
  ],
  declarations: [
    
  ],
})
export class BaseModule {}
