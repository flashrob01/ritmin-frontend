import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { FaqRoutingModule } from './faq-routing.module';
import { FaqTableComponent } from './faq-table/faq-table.component';

@NgModule({
  declarations: [FaqTableComponent],
  imports: [SharedModule, FaqRoutingModule],
})
export class FaqModule {}
