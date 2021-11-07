import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { FaqTableComponent } from './faq-table/faq-table.component';

const routes: Routes = [{ path: '', component: FaqTableComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FaqRoutingModule {}
