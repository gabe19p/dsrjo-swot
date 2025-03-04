import { Routes } from '@angular/router';
import { CategoriesComponent } from './pages/categories/categories.component';
import { EventPageComponent } from './pages/event-page/event-page.component';

export const routes: Routes = [
  {
    path: 'categories',
    component: CategoriesComponent,
  },
  {
    path: 'events',
    component: EventPageComponent,
  },
];
