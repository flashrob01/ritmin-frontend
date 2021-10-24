import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ProjectMonitorComponent } from './project-monitor.component';

const routes: Routes = [{ path: '', component: ProjectMonitorComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProjectMonitorRoutingModule { }
