import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RxState } from '@rx-angular/state';
import { PrimeIcons } from 'primeng/api';
import { LinkService } from '../core/services/link.service';
import { map } from 'rxjs/operators';
import { NekohitProjectService } from '../core/services/project.service';
import { NekoHitProject } from '../shared/models/project.model';

interface HomeComponentState {
  events: any[];
  responsiveCarouselOptions: any[];
  featuredProjects: NekoHitProject[];
}

const initState: HomeComponentState = {
  events: [],
  responsiveCarouselOptions: [
    {
      breakpoint: '1024px',
      numVisible: 3,
      numScroll: 3,
    },
    {
      breakpoint: '768px',
      numVisible: 2,
      numScroll: 2,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
      numScroll: 1,
    },
  ],
  featuredProjects: [],
};

@Component({
  selector: 'ritmin-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [RxState],
})
export class HomeComponent {
  state$ = this.state.select();
  encode = encodeURIComponent;

  constructor(
    public linkService: LinkService,
    public translate: TranslateService,
    projectService: NekohitProjectService,
    private state: RxState<HomeComponentState>
  ) {
    this.state.set(initState);
    this.state.connect(
      'featuredProjects',
      projectService.getProjects().pipe(
        map((projects) => {
          return projects.sort(() => 0.5 - Math.random()).slice(0, 4);
        })
      )
    );
    this.state.connect('events', this.$onLanguageChange);
  }

  $onLanguageChange = this.translate.onLangChange.pipe(
    map(() => [
      {
        status: this.translate.instant('LANDING.HOWTO.STEP_1_TITLE'),
        description: this.translate.instant('LANDING.HOWTO.STEP_1_TEXT'),
        icon: PrimeIcons.LINK,
      },
      {
        status: this.translate.instant('LANDING.HOWTO.STEP_2_TITLE'),
        description: this.translate.instant('LANDING.HOWTO.STEP_2_TEXT'),
        icon: PrimeIcons.PLUS,
      },
      {
        status: this.translate.instant('LANDING.HOWTO.STEP_3_TITLE'),
        description: this.translate.instant('LANDING.HOWTO.STEP_3_TEXT'),
        icon: PrimeIcons.TAGS,
      },
      {
        status: this.translate.instant('LANDING.HOWTO.STEP_4_TITLE'),
        description: this.translate.instant('LANDING.HOWTO.STEP_4_TEXT'),
        icon: PrimeIcons.MONEY_BILL,
      },
      {
        status: this.translate.instant('LANDING.HOWTO.STEP_5_TITLE'),
        description: this.translate.instant('LANDING.HOWTO.STEP_5_TEXT'),
        icon: PrimeIcons.COG,
      },
      {
        status: this.translate.instant('LANDING.HOWTO.STEP_6_TITLE'),
        description: this.translate.instant('LANDING.HOWTO.STEP_6_TEXT'),
        icon: PrimeIcons.CHECK,
      },
    ])
  );
}
