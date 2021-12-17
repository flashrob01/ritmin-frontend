import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { CountdownModule } from 'ngx-countdown';
import { ProjectDetailsRoutingModule } from './project-details.routing.module';
import { ProjectDetailsComponent } from './project-details.component';

@NgModule({
  declarations: [ProjectDetailsComponent],
  imports: [SharedModule, ProjectDetailsRoutingModule, CountdownModule],
})
export class ProjectDetailsModule {}
