import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { EventPageComponent } from './pages/event-page/event-page.component';
import { EventDetailsPageComponent } from './pages/event-details-page/event-details-page.component';

export const routes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'events',
    component: EventPageComponent,
  },
  {
    path: 'swot/events/:eventId',
    component: EventDetailsPageComponent,
  },
];
