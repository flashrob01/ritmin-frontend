import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { WcaDetailComponent } from './components/wca-detail/wca-detail.component';

const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'wcas/:id', component: WcaDetailComponent},
  { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
