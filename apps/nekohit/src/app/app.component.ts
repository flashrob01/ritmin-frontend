import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { LinkService } from './core/services/link.service';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'nekohit';
  showPromotion = true;

  constructor(public linkService: LinkService, translate: TranslateService) {
    const lang = localStorage.getItem('lang');
    translate.langs = ['en', 'de', 'cn'];
    if (lang && translate.langs.includes(lang)) {
      translate.use(lang).subscribe();
    } else {
      translate.use(translate.getBrowserLang()).subscribe();
    }

  }

}
