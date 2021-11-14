import { NgModule } from '@angular/core';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { SharedModule } from '../../shared/shared.module';
import { MyProjectsRoutingModule } from './my-projects-routing.module';
import { CountdownModule } from 'ngx-countdown';
import { ProjectCardComponent } from './my-projects/project-card/project-card.component';

@NgModule({
  declarations: [MyProjectsComponent, ProjectCardComponent],
  imports: [SharedModule, MyProjectsRoutingModule, CountdownModule],
})
export class MyProjectsModule {}
