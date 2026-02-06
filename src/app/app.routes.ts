import { Routes } from '@angular/router';
import { HomeViewComponent } from '@views/home/home-view.component';
import { NotFoundViewComponent } from '@views/not-found/not-found-view.component';
import { ProjectsViewComponent } from '@views/projects/project-view.component';
import { TestViewComponent } from '@views/test/test-view.component';
import { titleResolver } from './resolvers/title.resolver';

export const routes: Routes = [
  {
    path: '',
    component: HomeViewComponent,
    title: titleResolver,
  },
  {
    path: 'home',
    component: HomeViewComponent,
    title: titleResolver,
  },

  {
    path: 'projects',
    component: ProjectsViewComponent,
    title: titleResolver,
  },

  {
    path: 'test',
    component: TestViewComponent,
    title: titleResolver,
  },


  //catchall
  {
    path: '**',
    component: NotFoundViewComponent,
    title: titleResolver,
  }
];
