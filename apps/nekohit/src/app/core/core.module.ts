import { NgModule, Optional, SkipSelf } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ErrorService } from './services/error.service';
import { LinkService } from './services/link.service';
import { NeolineService } from './services/neoline.service';
import { NeonJSService } from './services/neonjs.service';
import { NotificationService } from './services/notification.service';
import { NekohitProjectService } from './services/project.service';

@NgModule({
  providers: [
    LinkService,
    NeolineService,
    NekohitProjectService,
    NeonJSService,
    ErrorService,
    MessageService,
    NotificationService,
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
