import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {DeclareProjectComponent} from './components/create-wca/declare-project.component';
import {HomeComponent} from './components/home/home.component';
import {ProjectDetailComponent} from './components/project-detail/project-detail.component';
import {AboutComponent} from './components/about/about.component';
import {BasicInfoComponent} from './components/create-wca/basic-info/basic-info.component';
import {MsInfoComponent} from './components/create-wca/ms-info/ms-info.component';
import {CompleteComponent} from './components/create-wca/complete/complete.component';
import {AuthGuard} from './guards/auth.guard';
import {InventoryComponent} from './components/inventory/inventory.component';
import {ExchangeComponent} from './components/exchange/exchange.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'projects/:id',
    component: ProjectDetailComponent
  },
  {
    path: 'about',
    component: AboutComponent
  },
  {
    path: 'inventory',
    component: InventoryComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'exchange',
    component: ExchangeComponent,
    canActivate: [AuthGuard]
  },
  {
    path: 'new',
    component: DeclareProjectComponent,
    children: [
      {path: 'project', component: BasicInfoComponent},
      {path: 'milestones', component: MsInfoComponent},
      {path: 'complete', component: CompleteComponent},
    ],
    canActivate: [AuthGuard]
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
