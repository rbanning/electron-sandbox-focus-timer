import { ITask, Task } from "./task.model";


export function mockTaskRepo(): ITask[] {
  return [
    new Task({
      id: 'mock01',
      name: 'PayPal Integration',
      status: 'pending',
      type: 'coding',
      projectId: '3',
      description: 'Update TransactionId',
      reminder: '2026-02-08T08:00:00',
      lastUpdated: '2025-12-21T09:02:00'
    }),
    new Task({
      id: 'mock02',
      name: 'Blog Post - Typescript',
      status: 'active',
      type: 'professional development',
      lastUpdated: '2025-12-31T09:02:00'
    }),
    new Task({
      id: 'mock03',
      name: 'Database Schema Design',
      status: 'completed',
      type: 'design',
      projectId: '1',
      description: 'Design normalized database schema for calendar events',
      lastUpdated: '2025-11-15T14:20:00'
    }),
    new Task({
      id: 'mock04',
      name: 'Client Presentation',
      status: 'active',
      type: 'sales',
      reminder: '2026-02-15T10:00:00',
      lastUpdated: '2026-02-10T08:30:00'
    }),
    new Task({
      id: 'mock05',
      name: 'API Unit Tests',
      status: 'pending',
      type: 'testing',
      projectId: '7',
      description: 'Write comprehensive unit tests for payment endpoints',
      reminder: '2026-02-18T09:00:00',
      lastUpdated: '2026-02-05T11:45:00'
    }),
    new Task({
      id: 'mock06',
      name: 'Marketing Campaign Analysis',
      status: 'active',
      type: 'marketing',
      lastUpdated: '2026-01-28T16:00:00'
    }),
    new Task({
      id: 'mock07',
      name: 'Data Pipeline Optimization',
      status: 'hold',
      type: 'data management',
      projectId: '6',
      description: 'Optimize ETL pipeline for image processing',
      lastUpdated: '2025-12-20T13:15:00'
    }),
    new Task({
      id: 'mock08',
      name: 'Q1 Financial Report',
      status: 'completed',
      type: 'finances',
      description: 'Prepare quarterly financial statements',
      lastUpdated: '2026-01-31T17:30:00'
    }),
    new Task({
      id: 'mock09',
      name: 'UI Component Library',
      status: 'active',
      type: 'coding',
      projectId: '5',
      reminder: '2026-02-20T10:00:00',
      lastUpdated: '2026-02-11T09:15:00'
    }),
    new Task({
      id: 'mock10',
      name: 'Customer Survey Analysis',
      status: 'pending',
      type: 'data analytics',
      projectId: '4',
      lastUpdated: '2026-02-01T14:00:00'
    }),
    new Task({
      id: 'mock11',
      name: 'Security Audit',
      status: 'issue',
      type: 'testing',
      projectId: '3',
      description: 'Address vulnerabilities found in penetration testing',
      reminder: '2026-02-13T08:00:00',
      lastUpdated: '2026-02-12T07:45:00'
    }),
    new Task({
      id: 'mock12',
      name: 'Technical Workshop',
      status: 'active',
      type: 'teaching',
      description: 'Prepare materials for Angular workshop',
      reminder: '2026-02-25T14:00:00',
      lastUpdated: '2026-02-09T10:30:00'
    }),
    new Task({
      id: 'mock13',
      name: 'RFP Response',
      status: 'pending',
      type: 'proposals',
      description: 'Prepare proposal for government contract',
      reminder: '2026-02-16T17:00:00',
      lastUpdated: '2026-02-08T15:20:00'
    }),
    new Task({
      id: 'mock14',
      name: 'Dashboard Visualizations',
      status: 'completed',
      type: 'data visualization',
      projectId: '4',
      lastUpdated: '2025-10-25T12:00:00'
    }),
    new Task({
      id: 'mock15',
      name: 'Contract Review',
      status: 'pending',
      type: 'legal',
      description: 'Review vendor agreements and SLAs',
      lastUpdated: '2026-02-07T11:00:00'
    }),
    new Task({
      id: 'mock16',
      name: 'Mobile App Research',
      status: 'active',
      type: 'research',
      projectId: '8',
      description: 'Research best practices for fitness tracking APIs',
      lastUpdated: '2026-02-10T13:45:00'
    }),
    new Task({
      id: 'mock17',
      name: 'Sprint Planning',
      status: 'completed',
      type: 'operations',
      projectId: '13',
      lastUpdated: '2026-02-06T09:00:00'
    }),
    new Task({
      id: 'mock18',
      name: 'Image Processing Pipeline',
      status: 'active',
      type: 'media development',
      projectId: '6',
      description: 'Build automated image preprocessing workflow',
      reminder: '2026-02-22T10:00:00',
      lastUpdated: '2026-02-11T16:30:00'
    }),
    new Task({
      id: 'mock19',
      name: 'Client Onboarding',
      status: 'active',
      type: 'client relations',
      projectId: '7',
      description: 'Coordinate kickoff meeting and requirements gathering',
      lastUpdated: '2026-02-10T10:00:00'
    }),
    new Task({
      id: 'mock20',
      name: 'Model Training',
      status: 'hold',
      type: 'data analytics',
      projectId: '13',
      description: 'Train NLP model with updated dataset',
      lastUpdated: '2026-01-30T14:15:00'
    }),
  ]
}