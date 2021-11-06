import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RxState } from '@rx-angular/state';
import { GlobalState, GLOBAL_RX_STATE } from '../global.state';

interface MilestoneConfig {
  title: string;
  icon: string;
}
@Component({
  selector: 'ritmin-create-project',
  templateUrl: './create-project.component.html',
  styleUrls: ['./create-project.component.scss'],
})
export class CreateProjectComponent implements OnInit {
  form: FormGroup = new FormGroup({});
  index = 0;
  milestones: MilestoneConfig[] = [
    {
      title: 'Milestone 1',
      icon: 'pi pi-calendar',
    },
    {
      title: 'Add',
      icon: 'pi pi-plus',
    },
  ];

  constructor(
    private fb: FormBuilder,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: '',
      description: '',
      fundingGoal: 0,
      securityStake: 0,
      public: true,
    });
  }

  get fundingGoal(): number {
    return this.form.get('fundingGoal')?.value;
  }

  get securityStake(): number {
    return this.form.get('securityStake')?.value;
  }

  public getSecurityRateSeverity(): string {
    let rate = 0;
    if (this.fundingGoal !== 0 && this.securityStake !== 0) {
      rate = this.securityStake / this.fundingGoal;
    }
    if (rate < 0.1) {
      return 'danger';
    } else if (rate < 0.5) {
      return 'warning';
    } else if (rate < 0.75) {
      return 'info';
    } else return 'success';
  }

  public onTabChange(event: any): void {
    if (event.index === this.milestones.length - 1) {
      this.milestones.splice(this.milestones.length - 1, 0, {
        title: 'Milestone ' + this.milestones.length,
        icon: 'pi pi-calendar',
      });
    }
  }
}
