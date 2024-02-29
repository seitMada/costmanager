import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { ArticlesComponent } from "./articles/articles.component";

// import { AccordionsComponent } from './accordion/accordions.component';
// import { BreadcrumbsComponent } from './breadcrumbs/breadcrumbs.component';
// import { CardsComponent } from './cards/cards.component';
// import { CarouselsComponent } from './carousels/carousels.component';
// import { CollapsesComponent } from './collapses/collapses.component';
// import { ListGroupsComponent } from './list-groups/list-groups.component';
// import { NavsComponent } from './navs/navs.component';
// import { PaginationsComponent } from './paginations/paginations.component';
// import { PopoversComponent } from './popovers/popovers.component';
// import { ProgressComponent } from './progress/progress.component';
// import { SpinnersComponent } from './spinners/spinners.component';
// import { TablesComponent } from './tables/tables.component';
// import { TooltipsComponent } from './tooltips/tooltips.component';
// import { TabsComponent } from './tabs/tabs.component';
// import { PlaceholdersComponent } from './placeholders/placeholders.component';

const routes: Routes = [
  {
    path: '',
    data: {
      title: 'Donnée de Base',
    },
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'articles',
      },
      {
        path: 'articles',
        component: ArticlesComponent,
        data: {
          title: 'Articles',
        },
      }
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BaseRoutingModule {}

