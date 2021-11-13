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
    path: 'faq',
    loadChildren: () =>
      import('./features/faq/faq.module').then((m) => m.FaqModule),
  },
  {
    path: 'profile/projects',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/my-projects/my-projects.module').then(
        (m) => m.MyProjectsModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
