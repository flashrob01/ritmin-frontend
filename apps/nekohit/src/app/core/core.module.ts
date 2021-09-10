import { NgModule, Optional, SkipSelf } from '@angular/core';
import { LinkService } from './services/link.service';

@NgModule({
  providers: [
    LinkService
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
