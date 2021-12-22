import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MyStakingsComponent } from './my-stakings/my-stakings.component';

const routes: Routes = [{ path: '', component: MyStakingsComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyStakingsRoutingModule {}
