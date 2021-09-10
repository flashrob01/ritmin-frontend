import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { PrimeIcons } from 'primeng/api';
import { LinkService } from '../core/services/link.service';

@Component({
  selector: 'ritmin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  events: any[] = [];

  constructor(public linkService: LinkService, public translate: TranslateService) {
    translate.onLangChange.subscribe(() => {
      this.events = [
        {status: translate.instant('LANDING.HOWTO.STEP_1_TITLE'), description: translate.instant('LANDING.HOWTO.STEP_1_TEXT'), icon: PrimeIcons.LINK},
        {status: translate.instant('LANDING.HOWTO.STEP_2_TITLE'), description: translate.instant('LANDING.HOWTO.STEP_2_TEXT'), icon: PrimeIcons.PLUS},
        {status: translate.instant('LANDING.HOWTO.STEP_3_TITLE'), description: translate.instant('LANDING.HOWTO.STEP_3_TEXT'),  icon: PrimeIcons.TAGS},
        {status: translate.instant('LANDING.HOWTO.STEP_4_TITLE'), description: translate.instant('LANDING.HOWTO.STEP_4_TEXT'),  icon: PrimeIcons.MONEY_BILL},
        {status: translate.instant('LANDING.HOWTO.STEP_5_TITLE'), description: translate.instant('LANDING.HOWTO.STEP_5_TEXT'),  icon: PrimeIcons.COG},
        {status: translate.instant('LANDING.HOWTO.STEP_6_TITLE'), description: translate.instant('LANDING.HOWTO.STEP_6_TEXT'), icon: PrimeIcons.CHECK}
      ];
    })
  }

}
