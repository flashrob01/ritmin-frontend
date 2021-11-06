import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { SelectItem } from 'primeng/api';
import { Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { GlobalState, GLOBAL_RX_STATE } from '../global.state';

interface MilestoneConfig {
  title: string;
  icon: string;
}

interface CreateProjectState {
  tokens: SelectItem[];
  form: FormGroup;
  milestones: MilestoneConfig[];
}

const initState: CreateProjectState = {
  tokens: [],
  form: new FormGroup({}),
  milestones: [
    { title: 'Milestone 1', icon: 'pi pi-calendar' },
    { title: 'Add', icon: 'pi pi-plus' },
  ],
};

@Component({
  selector: 'ritmin-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent {
  state$ = this.state.select();

  onTabChange$ = new Subject<{ index: number }>();
  clickTokenOption$ = new Subject();

  constructor(
    private state: RxState<CreateProjectState>,
    private fb: FormBuilder,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>
  ) {
    const gasHash = this.globalState.get('mainnet')
      ? environment.mainnet.gasContractHash
      : environment.testnet.gasContractHash;
    const catHash = this.globalState.get('mainnet')
      ? environment.mainnet.catTokenHash
      : environment.testnet.catTokenHash;
    initState.form = this.fb.group({
      name: '',
      description: '',
      fundingGoal: 1,
      securityStake: 1,
      token: { value: catHash, label: 'CAT' },
      public: true,
    });
    this.state.set(initState);
    this.state.set({
      tokens: [
        { value: catHash, label: 'CAT' },
        { value: gasHash, label: 'GAS' },
      ],
    });

    this.state.hold(this.onTabChange$, (e) => {
      const milestones = this.state.get('milestones');
      if (e.index === milestones.length - 1) {
        milestones.splice(milestones.length - 1, 0, {
          title: 'Milestone ' + milestones.length,
          icon: 'pi pi-calendar',
        });
      }
    });
    this.state.hold(this.clickTokenOption$, (e) =>
      console.log('token change', e)
    );
  }

  get fundingGoal(): number {
    return this.state.get('form').get('fundingGoal')?.value;
  }

  get securityStake(): number {
    return this.state.get('form').get('securityStake')?.value;
  }

  get token(): SelectItem {
    return this.state.get('form').get('token')?.value;
  }

  getTokenDecimals(): number {
    return this.state.get('form')?.get('token')?.value.label === 'CAT' ? 2 : 8;
  }

  getTokenSuffix(): string {
    return this.state.get('form')?.get('token')?.value.label === 'CAT'
      ? ' CAT'
      : ' GAS';
  }

  calculatePrice(amount: number, token: SelectItem): number {
    const price =
      token.label === 'CAT'
        ? this.globalState.get('catPrice')
        : this.globalState.get('gasPrice');
    return Math.round(price * amount * 100) / 100;
  }
}
