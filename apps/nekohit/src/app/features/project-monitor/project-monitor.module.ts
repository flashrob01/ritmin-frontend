import { NgModule } from '@angular/core';

import { ProjectMonitorRoutingModule } from './project-monitor-routing.module';
import { ProjectMonitorComponent } from './project-monitor.component';

import { SharedModule } from '../../shared/shared.module';

@NgModule({
  declarations: [ProjectMonitorComponent],
  imports: [ProjectMonitorRoutingModule, SharedModule],
})
export class ProjectMonitorModule {}
