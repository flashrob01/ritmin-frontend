import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WcaDetailComponent } from './components/wca-detail/wca-detail.component';
import {AboutComponent} from './components/about/about.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'wcas/:id', component: WcaDetailComponent},
  {path: 'about', component: AboutComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
