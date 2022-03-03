import { Component, Inject, ViewEncapsulation } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { TranslateService } from '@ngx-translate/core';
import { LinkService } from '../core/services/link.service';
import { RxState } from '@rx-angular/state';
import { NeolineService } from '../core/services/neoline.service';
import { GlobalState, GLOBAL_RX_STATE } from '../global.state';
import { DialogService } from 'primeng/dynamicdialog';
import { CreateProjectComponent } from '../create-project/create-project.component';
import { Router } from '@angular/router';

interface MenuState {
  menuItems: MenuItem[];
  baseMenuItems: MenuItem[];
}

const initState: MenuState = {
  menuItems: [],
  baseMenuItems: [],
};

@Component({
  selector: 'ritmin-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [RxState, DialogService],
})
export class MenuComponent {
  readonly state$ = this.state.select();
  readonly address$ = this.globalState.select('address');
  readonly svgAvatar$ = this.globalState.select('svgAvatar');

  constructor(
    public translate: TranslateService,
    private linkService: LinkService,
    private state: RxState<MenuState>,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>,
    public neoline: NeolineService,
    private dialogService: DialogService,
    private router: Router
  ) {
    this.state.hold(this.translate.onLangChange, (v) => {
      localStorage.setItem('lang', v.lang);
      this.state.set(initState);
      const items = [
        {
          label: this.translate.instant('MENU.BROWSE'),
          icon: 'pi pi-search',
          routerLink: 'browse',
        },
       /*  {
          label: this.translate.instant('MENU.WHITEPAPER'),
          icon: 'pi pi-file-o',
          command: () => this.linkService.openWhitepaper(),
        }, */
        {
          label: this.translate.instant('MENU.BLOG'),
          icon: 'pi pi-book',
          command: () => this.linkService.openBlog(),
        },
        {
          label: this.translate.instant('MENU.FAQ'),
          icon: 'pi pi-question',
          command: () => this.router.navigate(['/'], { fragment: 'faq' }),
        },
      ];
      this.state.set({ menuItems: items });
      this.state.set({ baseMenuItems: items });
      this.state.hold(this.address$, () => {
        const baseMenuItems = JSON.parse(
          JSON.stringify(this.state.get('baseMenuItems'))
        );
        baseMenuItems.push(
          {
            label: this.translate.instant('MENU.CREATE'),
            icon: 'pi pi-plus',
            command: () =>
              this.dialogService.open(CreateProjectComponent, {
                header: 'Create a new project',
                width: '80%',
              }),
            styleClass: 'loggedInMenuItem',
          },
          {
            label: this.translate.instant('MENU.ACCOUNT'),
            icon: 'pi pi-user',
            styleClass: 'loggedInMenuItem',
            items: [
              {
                label: this.translate.instant('MENU.STAKINGS'),
                icon: 'pi pi-wallet',
                routerLink: 'profile/stakings',
                styleClass: 'loggedInMenuItem',
              },
              {
                label: this.translate.instant('MENU.PROJECTS'),
                icon: 'pi pi-list',
                routerLink: 'profile/projects',
                styleClass: 'loggedInMenuItem',
              },
            ],
          },
          {
            label: this.translate.instant('MENU.EXCHANGE'),
            icon: 'pi pi-wallet',
            routerLink: 'exchange',
            styleClass: 'loggedInMenuItem',
          }
        );
        this.state.set({ menuItems: baseMenuItems });
      });
    });
  }
}
