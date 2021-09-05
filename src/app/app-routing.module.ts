import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {CreateWcaComponent} from './components/create-wca/create-wca.component';
import {HomeComponent} from './components/home/home.component';
import {WcaDetailComponent} from './components/wca-detail/wca-detail.component';
import {AboutComponent} from './components/about/about.component';
import {BasicInfoComponent} from './components/create-wca/basic-info/basic-info.component';
import {MsInfoComponent} from './components/create-wca/ms-info/ms-info.component';
import {CompleteComponent} from './components/create-wca/complete/complete.component';
import {AuthGuard} from './guards/auth.guard';
import {InventoryComponent} from './components/inventory/inventory.component';

const routes: Routes = [
  {
    path: '',
    component: HomeComponent
  },
  {
    path: 'wcas/:id',
    component: WcaDetailComponent
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
    path: 'new',
    component: CreateWcaComponent,
    children: [
      {path: 'wca', component: BasicInfoComponent},
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
