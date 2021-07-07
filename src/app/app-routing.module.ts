import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWcaComponent } from './components/create-wca/create-wca.component';
import { HomeComponent } from './components/home/home.component';
import { WcaDetailComponent } from './components/wca-detail/wca-detail.component';
import { AboutComponent } from './components/about/about.component';
import { BasicInfoComponent } from './components/create-wca/basic-info/basic-info.component';
import { MsInfoComponent } from './components/create-wca/ms-info/ms-info.component';
import { CompleteComponent } from './components/create-wca/complete/complete.component';

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
    path: 'new',
    component: CreateWcaComponent,
    children: [
      { path: 'basic-info', component: BasicInfoComponent },
      { path: 'ms-info', component: MsInfoComponent },
      { path: 'complete', component: CompleteComponent },
    ]
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
export class AppRoutingModule { }
