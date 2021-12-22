import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { MyStakingsRoutingModule } from './my-stakings-routing.module';
import { MyStakingsComponent } from './my-stakings/my-stakings.component';

@NgModule({
  declarations: [MyStakingsComponent],
  imports: [SharedModule, MyStakingsRoutingModule],
})
export class MyStakingsModule {}
