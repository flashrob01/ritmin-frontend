import { NgModule } from '@angular/core';
import { SharedModule } from '../../shared/shared.module';
import { ExchangeRoutingModule } from './exchange.routing.module';
import { ExchangeComponent } from './exchange.component';
import { ExchangeService } from './exchange.service';

@NgModule({
  declarations: [ExchangeComponent],
  imports: [SharedModule, ExchangeRoutingModule],
  providers: [ExchangeService],
})
export class ExchangeModule {}
