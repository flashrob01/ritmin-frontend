import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AuthGuard } from './core/guards/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'browse',
    loadChildren: () =>
      import('./features/project-monitor/project-monitor.module').then(
        (m) => m.ProjectMonitorModule
      ),
  },
  {
    path: 'profile/projects',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/my-projects/my-projects.module').then(
        (m) => m.MyProjectsModule
      ),
  },
  {
    path: 'projects/:id',
    loadChildren: () =>
      import('./features/project-details/project-details.module').then(
        (m) => m.ProjectDetailsModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
