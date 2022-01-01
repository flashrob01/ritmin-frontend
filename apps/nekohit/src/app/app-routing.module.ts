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
    path: 'profile/stakings',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/stakings/my-stakings.module').then(
        (m) => m.MyStakingsModule
      ),
  },
  {
    path: 'projects/:id',
    loadChildren: () =>
      import('./features/project-details/project-details.module').then(
        (m) => m.ProjectDetailsModule
      ),
  },
  {
    path: 'exchange',
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./features/exchange/exchange.module').then(
        (m) => m.ExchangeModule
      ),
  },
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes, { anchorScrolling: 'enabled' })],
  exports: [RouterModule],
})
export class AppRoutingModule {}
