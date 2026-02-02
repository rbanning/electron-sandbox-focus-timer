import { Routes } from '@angular/router';
import { HomeViewComponent } from '@views/home/home-view.component';
import { NotFoundViewComponent } from '@views/not-found/not-found-view.component';
import { TestViewComponent } from '@views/test/test-view.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent
  },
  {
    path: 'home',
    component: HomeViewComponent
  },

  {
    path: 'test',
    component: TestViewComponent
  },


  //catchall
  {
    path: '**',
    component: NotFoundViewComponent
  }
];
