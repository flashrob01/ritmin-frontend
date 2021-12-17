import { NgModule, Optional, SkipSelf } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { BinanceService } from './services/binance.service';
import { ErrorService } from './services/error.service';
import { LinkService } from './services/link.service';
import { NeolineService } from './services/neoline.service';
import { NeonJSService } from './services/neonjs.service';
import { NotificationService } from './services/notification.service';
import { NekohitProjectService } from './services/project.service';
import { TokenService } from './services/token.service';

@NgModule({
  providers: [
    LinkService,
    NeolineService,
    NekohitProjectService,
    NeonJSService,
    ErrorService,
    MessageService,
    NotificationService,
    BinanceService,
    ConfirmationService,
    TokenService,
  ],
})
export class CoreModule {
  constructor(@Optional() @SkipSelf() parentModule: CoreModule) {
    if (parentModule) {
      throw new Error(
        'CoreModule is already loaded. Import it in the AppModule only'
      );
    }
  }
}
