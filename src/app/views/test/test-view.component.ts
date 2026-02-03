import { arrayHelp } from './../../common/general/array-help';
import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SizeProp } from '@fortawesome/fontawesome-svg-core';
import { IProject, Project, ProjectStatus, projectStatusList, ProjectType, projectTypeList } from '@services/project/project.model';
import { ProjectStatusComponent } from '@components/project/project-status.component';
import { ProjectTypeComponent } from '@components/project/project-type.component';
import { ProjectListComponent } from '@components/project/project-list.component';
import { ProjectService } from '@services/project/project.service';

@Component({
  selector: 'app-test-view',
  standalone: true,
  imports: [CommonModule, ProjectStatusComponent, ProjectTypeComponent, ProjectListComponent],
  templateUrl: './test-view.component.html',
  styles: ':host { display: block; }'
})
export class TestViewComponent {
  title = signal("Testing...");

  subtitle = signal("Project Status + Type + Card Components");

  statusList = signal<readonly ProjectStatus[]>(projectStatusList);
  typeList = signal<readonly ProjectType[]>(projectTypeList);

  sizeList = signal<readonly SizeProp[]>(['sm', '1x', 'lg']);

  private service = inject(ProjectService);
  constructor() {    
    //this.service.seed(arrayHelp.take(mockProjects(), 2));
  }
}

function mockProjects(): IProject[] {
  return [
    new Project({ 
      id: '1', 
      name: 'Calendar', 
      client: 'Sage Academy', 
      type: 'web-app', 
      status: 'active', 
      startDate: '2025-12-10T09:30:00', 
      lastUpdated: '2025-12-10T09:30:00'
    }),
    new Project({ 
      id: '2', 
      name: 'Hotel Occupancy', 
      type: 'data-science', 
    }),
    new Project({
      id: '3',
      name: 'Mobile Banking App',
      client: 'FinTech Solutions',
      type: 'backend-api',
      status: 'hold',
      startDate: '2025-11-15T08:00:00',
      lastUpdated: '2026-01-28T14:20:00'
    }),
    new Project({
      id: '4',
      name: 'Analytics Dashboard',
      client: 'DataFlow Inc',
      type: 'web-app',
      status: 'completed',
      startDate: '2025-08-01T10:00:00',
      lastUpdated: '2025-10-30T16:45:00'
    }),
    new Project({
      id: '5',
      name: 'Customer Portal',
      client: 'Retail Corp',
      type: 'web-app',
      status: 'issue',
      startDate: '2025-09-20T09:00:00',
      lastUpdated: '2026-01-10T11:30:00'
    }),
    new Project({
      id: '6',
      name: 'ML Image Recognition',
      type: 'data-science',
      status: 'active'
    }),
    new Project({
      id: '7',
      name: 'E-Commerce Platform',
      client: 'ShopHub',
      type: 'backend-api',
      status: 'active',
      startDate: '2025-10-05T07:30:00',
      lastUpdated: '2026-01-30T13:15:00'
    }),
    new Project({
      id: '8',
      name: 'iOS Fitness Tracker',
      client: 'HealthTech',
      type: 'learning',
      status: 'active',
      startDate: '2025-12-01T08:00:00',
      lastUpdated: '2026-02-01T10:00:00'
    }),
    new Project({
      id: '9',
      name: 'Predictive Analytics',
      client: 'Fortune 500 Corp',
      type: 'data-science',
      status: 'completed',
      startDate: '2025-07-10T09:00:00',
      lastUpdated: '2025-11-25T17:00:00'
    }),
    new Project({
      id: '10',
      name: 'Cloud Migration',
      client: 'Enterprise Ltd',
      type: 'web-app',
      status: 'cancelled',
      startDate: '2025-11-01T08:30:00',
      lastUpdated: '2026-01-25T15:45:00'
    }),
    new Project({
      id: '11',
      name: 'Android Payment Gateway',
      type: 'learning',
      status: 'issue'
    }),
    new Project({
      id: '12',
      name: 'Legacy System Modernization',
      client: 'Government Agency',
      type: 'data-science',
      status: 'hold',
      startDate: '2025-06-15T09:00:00',
      lastUpdated: '2026-01-20T12:00:00'
    }),
    new Project({
      id: '13',
      name: 'NLP Chatbot',
      client: 'Tech Startup',
      type: 'data-science',
      status: 'active',
      startDate: '2025-12-10T10:00:00',
      lastUpdated: '2026-02-01T09:30:00'
    }),
    new Project({
      id: '14',
      name: 'Supply Chain Optimizer',
      client: 'Logistics Plus',
      type: 'data-science',
      status: 'completed',
      startDate: '2025-05-20T08:00:00',
      lastUpdated: '2025-12-15T14:20:00'
    })
  ]
}