import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { ConfirmationService, SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import {
  CreateProjectArgs,
  NekohitProjectService,
} from '../core/services/project.service';
import { NotificationService } from '../core/services/notification.service';
import { GlobalState, GLOBAL_RX_STATE } from '../global.state';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { CAT_SYMBOL, TokenService } from '../core/services/token.service';
import { BinanceService } from '../core/services/binance.service';
import { map, tap } from 'rxjs/operators';

interface MilestoneConfig {
  label: string;
  icon: string;
  title?: string;
  description?: string;
  deadline?: Date;
  isThreshold?: boolean;
  index: number;
}

interface CreateProjectState {
  tokens: SelectItem[];
  form: FormGroup;
  milestones: MilestoneConfig[];
  threshold: number;
  selectedTokenPrice: number;
}

const initState: CreateProjectState = {
  tokens: [],
  form: new FormGroup({}),
  milestones: [
    {
      label: 'Milestone 1',
      icon: 'pi pi-calendar',
      index: 0,
      title: 'Milestone 1',
    },
    {
      label: 'Add',
      icon: 'pi pi-plus',
      index: -1,
    },
  ],
  threshold: 0,
  selectedTokenPrice: 0.5,
};

@Component({
  selector: 'ritmin-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent {
  state$ = this.state.select();
  math = Math;
  onTabChange$ = new Subject<{ index: number }>();

  tokenSelected$ = new Subject<{ value: SelectItem }>();

  constructor(
    private state: RxState<CreateProjectState>,
    private fb: FormBuilder,
    private projectService: NekohitProjectService,
    private confirmationService: ConfirmationService,
    private notification: NotificationService,
    private dynamicDialog: DynamicDialogRef,
    public tokenService: TokenService,
    private binance: BinanceService,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>
  ) {
    const catToken = tokenService.getTokenBySymbol(CAT_SYMBOL);

    initState.form = this.fb.group({
      name: '',
      description: '',
      fundingGoal: 1,
      securityStakePercent: 1,
      token: { value: catToken.hash, label: CAT_SYMBOL },
      public: true,
      thresholdIndex: 0,
      cooldownInterval: 1,
    });
    this.state.set(initState);
    this.state.set({
      tokens: tokenService
        .getTokens()
        .map((token) => ({ value: token.hash, label: token.symbol })),
    });

    this.state.hold(this.onTabChange$, (e) => {
      const milestones = this.state.get('milestones');
      if (e.index === milestones.length - 1) {
        milestones.splice(milestones.length - 1, 0, {
          label: 'Milestone ' + milestones.length,
          icon: 'pi pi-calendar',
          index: e.index,
          title: 'Milestone ' + milestones.length,
        });
      }
    });

    this.state.hold(this.tokenSelected$, (event) => {
      this.state.get('form').get('fundingGoal')?.setValue(0);
      this.state.get('form').get('securityStakePercent')?.setValue(0);
      const token = this.tokenService.getTokenByHash(event.value.value);
      const precision = Math.pow(10, token.decimals);
      this.binance
        .getPrice(token.symbol)
        .pipe(map((price) => Math.round(price * precision) / precision))
        .subscribe((res) => {
          this.state.set({ selectedTokenPrice: res });
        });
    });
  }

  get projectName(): string {
    return this.state.get('form').get('name')?.value;
  }

  get projectDescription(): string {
    return this.state.get('form').get('description')?.value;
  }

  get fundingGoal(): number {
    return this.state.get('form').get('fundingGoal')?.value;
  }

  get securityStakePercent(): number {
    return this.state.get('form').get('securityStakePercent')?.value;
  }

  get token(): SelectItem {
    return this.state.get('form').get('token')?.value;
  }

  get cooldown(): number {
    return this.state.get('form').get('cooldownInterval')?.value;
  }

  get isPublic(): boolean {
    return this.state.get('form').get('public')?.value;
  }

  get thresholdIndex(): number {
    return this.state.get('form').get('thresholdIndex')?.value;
  }

  getMinDateForMs(index: number): Date {
    const temp = new Date();
    if (index == 0) {
      temp.setDate(temp.getDate() + 1);
      return temp;
    } else {
      const ms = this.state.get('milestones')[index - 1];
      if (ms.deadline !== undefined) {
        temp.setDate(ms.deadline.getDate() + 1);
        return temp;
      } else throw Error('previous milestone date should not be undefined');
    }
  }

  getTokenBalance(symbol: string): number {
    const balance = (this.globalState.get('balances') as any)[symbol];
    return balance != null ? balance : 0;
  }

  getValidMilestoneOptions(): MilestoneConfig[] {
    return this.state.get('milestones').filter((ms) => ms.index !== -1);
  }

  submitProject(event: any): void {
    this.confirmationService.confirm({
      target: event.target,
      message:
        'The developer fee for creating a project is an additional ' +
        '0.02 GAS',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'I understand',
      rejectLabel: 'Cancel',
      accept: () => {
        const decimals = this.tokenService.getTokenBySymbol(
          this.token.label as string
        ).decimals;

        const milestones = this.state
          .get('milestones')
          .filter((ms) => ms.index !== -1);
        const args: CreateProjectArgs = {
          creator: this.globalState.get('address'),
          token: this.token.value,
          cooldownInMs: this.cooldown * 60 * 60 * 1000,
          fundingGoal: this.fundingGoal * Math.pow(10, decimals),
          isPublic: this.isPublic,
          milestoneDeadlines: milestones.map((ms) =>
            (ms.deadline as Date).getTime()
          ),
          milestoneDescriptions: milestones.map(
            (ms) => ms.description as string
          ),
          milestoneTitles: milestones.map((ms) => ms.title as string),
          projectDescription: this.projectDescription,
          projectTitle: this.projectName,
          stakePer100Token: this.securityStakePercent,
          thresholdIndex: this.thresholdIndex,
        };
        console.log('createProjectsArgs', args);
        this.projectService.createProject(args).subscribe((res) => {
          this.dynamicDialog.close();
          this.notification.tx(res.txid);
        });
      },
    });
  }
}
