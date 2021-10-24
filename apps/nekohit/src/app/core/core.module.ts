import { NgModule, Optional, SkipSelf } from '@angular/core';
import { LinkService } from './services/link.service';
import { NeolineService } from './services/neoline.service';

@NgModule({
  providers: [
    LinkService,
    NeolineService
  ]
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
