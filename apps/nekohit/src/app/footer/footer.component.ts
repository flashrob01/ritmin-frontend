import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'ritmin-footer',
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.scss']
})
export class FooterComponent {

  constructor(private translate: TranslateService) { }

  changeLanguage(lang: string) {
    this.translate.use(lang).subscribe();
  }

}
