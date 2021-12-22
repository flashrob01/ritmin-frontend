import { NgModule } from '@angular/core';
import { MyProjectsComponent } from './my-projects/my-projects.component';
import { SharedModule } from '../../shared/shared.module';
import { MyProjectsRoutingModule } from './my-projects-routing.module';

@NgModule({
  declarations: [MyProjectsComponent],
  imports: [SharedModule, MyProjectsRoutingModule],
})
export class MyProjectsModule {}
