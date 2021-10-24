import { NgModule } from '@angular/core';

import { ProjectMonitorRoutingModule } from './project-monitor-routing.module';
import { ProjectMonitorComponent } from './project-monitor.component';

import { TableModule } from 'primeng/table';
import { SharedModule } from 'primeng/api';

@NgModule({
  declarations: [
    ProjectMonitorComponent
  ],
  imports: [
    ProjectMonitorRoutingModule,
    TableModule,
    SharedModule
  ]
})
export class ProjectMonitorModule { }
