import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateWcaComponent } from './components/create-wca/create-wca.component';
import { HomeComponent } from './components/home/home.component';
import { WcaDetailComponent } from './components/wca-detail/wca-detail.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'wcas/:id', component: WcaDetailComponent},
  {path: 'new', component: CreateWcaComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
