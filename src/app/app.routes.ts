import { Routes } from '@angular/router';
import { HomeViewComponent } from '@views/home/home-view.component';
import { NotFoundViewComponent } from '@views/not-found/not-found-view.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent
  },
  {
    path: 'home',
    component: HomeViewComponent
  },


  //catchall
  {
    path: '**',
    component: NotFoundViewComponent
  }
];
