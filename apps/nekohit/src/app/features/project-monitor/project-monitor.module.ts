import { NgModule } from '@angular/core';

import { ProjectMonitorRoutingModule } from './project-monitor-routing.module';
import { ProjectMonitorComponent } from './project-monitor.component';

import { TableModule } from 'primeng/table';
import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProjectMonitorComponent],
  imports: [ProjectMonitorRoutingModule, TableModule, SharedModule],
})
export class ProjectMonitorModule {}
