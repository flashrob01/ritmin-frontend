import { Component, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { CountdownConfig } from 'ngx-countdown';
import { Subject } from 'rxjs';
import { filter, map, switchMap } from 'rxjs/operators';
import { NotificationService } from '../../core/services/notification.service';
import { NekohitProjectService } from '../../core/services/project.service';
import { TokenService } from '../../core/services/token.service';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { Milestone, NekoHitProject } from '../../shared/models/project.model';

interface ProjectDetailsState {
  project: NekoHitProject;
  securityStake: number;
  proofOfWork: string;
  timeline: ProjectTimeline[];
  openMilestones: Milestone[];
  selectedMilestone: Milestone;
  countdownConfig: CountdownConfig;
  stakingAmount: number;
}

interface ProjectTimeline {
  date: Date;
  text: string;
  subtext?: string;
  color: string;
  showDate: boolean;
  borderColor?: string;
  class?: string;
}

@Component({
  selector: 'ritmin-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [RxState],
})
export class ProjectDetailsComponent {
  math = Math;
  state$ = this.state.select();
  stakeTokenBtnClicked$ = new Subject<void>();
  fundProjectBtnClicked$ = new Subject<void>();
  completeMsBtnClicked$ = new Subject<void>();
  completeProjectBtnClicked$ = new Subject<void>();
  refundBtnClicked$ = new Subject<void>();
  securityStakeAmount = 0;

  loadProject$ = this.route.params.pipe(
    switchMap((param) =>
      this.projectService
        .getProject(decodeURIComponent(param.id))
        .pipe(map((project) => this.mapChartDataToProject(project)))
    )
  );

  updateTimeline$ = this.state
    .select('project')
    .pipe(map((project) => this.getProjectTimeline(project)));
  updateSecurityStake$ = this.state
    .select('project')
    .pipe(
      map((project) => project.stakePer100Token * project.maxTokenSoldCount)
    );
  updateOpenMilestones$ = this.state
    .select('project')
    .pipe(
      map((project) =>
        project.milestones.filter(
          (ms) => ms.endTimestamp > new Date() && ms.linkToResult === null
        )
      )
    );

  updateCountdownConfig$ = this.state.select('project').pipe(
    map((project) => {
      const countdownConfig: CountdownConfig = {
        leftTime:
          (project.lastUpdateTimestamp.getTime() +
            project.coolDownInterval -
            new Date().getTime()) /
          1000,
      };
      return countdownConfig;
    })
  );

  getStakingInfo$ = this.state.select('project').pipe(
    filter((project) => !!project),
    switchMap((project) =>
      this.projectService.getStakingInfos(project.identifier)
    )
  );

  constructor(
    private state: RxState<ProjectDetailsState>,
    private route: ActivatedRoute,
    private projectService: NekohitProjectService,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>,
    private notification: NotificationService,
    public tokenService: TokenService
  ) {
    this.state.set({ proofOfWork: '' });
    this.state.connect('project', this.loadProject$);
    this.state.connect('securityStake', this.updateSecurityStake$);
    this.state.connect('openMilestones', this.updateOpenMilestones$);
    this.state.connect('timeline', this.updateTimeline$);
    this.state.connect('countdownConfig', this.updateCountdownConfig$);
    this.state.connect('stakingAmount', this.getStakingInfo$);
    this.state.hold(this.stakeTokenBtnClicked$, () =>
      this.stakeTokens(
        this.state.get('project').stakePer100Token *
          this.state.get('project').maxTokenSoldCount
      )
    );
    this.state.hold(this.fundProjectBtnClicked$, () => {
      const project = this.state.get('project');
      const decimals = this.tokenService.getTokenBySymbol(
        project.tokenSymbol
      ).decimals;
      const amount =
        (this.state.get('project').stakeInput || 0) * Math.pow(10, decimals);
      this.stakeTokens(amount);
    });
    this.state.hold(this.completeMsBtnClicked$, () => this.completeMilestone());
    this.state.hold(this.completeProjectBtnClicked$, () =>
      this.completeProject()
    );
    this.state.hold(this.refundBtnClicked$, () => this.refund());
  }

  private mapChartDataToProject(project: NekoHitProject): NekoHitProject {
    const data = {
      labels: ['Remaining', 'Funded'],
      datasets: [
        {
          data: [
            project.remainTokenCount,
            project.maxTokenSoldCount - project.remainTokenCount,
          ],
          backgroundColor: ['#ddd', '#2196f3'],
          hoverBackgroundColor: ['#ddd', '#2196f3'],
        },
      ],
    };
    project.stakedTokensChartData = data;
    return project;
  }

  private stakeTokens(amount: number): void {
    const project = this.state.get('project');
    this.projectService
      .stakeTokens(
        amount,
        project.identifier,
        this.tokenService.getTokenBySymbol(project.tokenSymbol).hash
      )
      .subscribe((res) => {
        this.notification.tx(res.txid);
      });
  }

  private completeProject(): void {
    const project = this.state.get('project');
    this.projectService.finishProject(project.identifier).subscribe((res) => {
      this.notification.tx(res.txid);
    });
  }

  private completeMilestone(): void {
    const project = this.state.get('project');
    console.log('value', this.state.get('selectedMilestone'));
    const ms = this.state.get('selectedMilestone');
    let msIndex = project.nextMilestone;
    project.milestones.forEach((milestone, i) => {
      if (ms.endTimestamp === milestone.endTimestamp) {
        msIndex = i;
      }
    });

    this.projectService
      .finishMilestone(
        project.identifier,
        msIndex,
        this.state.get('proofOfWork')
      )
      .subscribe((res) => {
        this.notification.tx(res.txid);
      });
  }

  private refund(): void {
    const project = this.state.get('project');
    this.projectService.refund(project.identifier).subscribe((res) => {
      this.notification.tx(res.txid);
    });
  }

  public getProjectTimeline(project: NekoHitProject): ProjectTimeline[] {
    const timeline: ProjectTimeline[] = [];
    /* add all milestones */
    timeline.push(
      ...project.milestones.map((ms) => ({
        date: ms.endTimestamp,
        text: ms.title,
        color: 'white',
        borderColor: '#2196f3',
        class: 'timeline-event-marker',
        subtext: '100% Refund',
        showDate: true,
      }))
    );
    /* update color for finished milestones */
    timeline
      .filter((tl, i) => i < project.nextMilestone)
      .forEach((tl) => (tl.color = '#2196f3'));

    /* calculate refund amount */

    const totalMilestones = project.milestonesCount;
    timeline.forEach((tl, i) => {
      if (i >= project.thresholdMilestoneIndex) {
        const remainingMs = totalMilestones - i - 1;
        const result = (remainingMs / totalMilestones) * 100;
        const rounded = Math.round(result * 100) / 100;
        tl.subtext = String(rounded + '% refund');
      }
    });

    /* add a marker for current status if project is not finished*/
    if (project.status !== 'FINISHED') {
      const currentLabel = 'Current Status';
      let nextMilestoneDate;
      if (project.nextMilestone !== project.milestonesCount) {
        nextMilestoneDate = timeline[project.nextMilestone].date?.getTime() - 1;
      } else {
        nextMilestoneDate =
          timeline[project.nextMilestone - 1].date.getTime() + 1;
      }
      timeline.push({
        text: currentLabel,
        date: new Date(nextMilestoneDate),
        color: '#00e599',
        borderColor: '#00e599',
        class: 'timeline-event-marker',
        showDate: false,
      });
    }

    timeline.sort(function compare(a, b) {
      const dateA = new Date(a.date || new Date());
      const dateB = new Date(b.date || new Date());
      return dateA.getTime() - dateB.getTime();
    });

    const finishMarkerColor =
      project.status === 'FINISHED' ? '#2196f3' : 'white';
    /* add end to timeline */
    timeline.push({
      text: 'End',
      color: finishMarkerColor,
      borderColor: '#2196f3',
      class: 'timeline-event-marker',
      showDate: false,
      date: new Date(),
    });
    /* add start to timeline */
    timeline.unshift({
      date: project.creationTimestamp,
      text: 'Start',
      color: '#2196f3',
      class: 'timeline-event-marker',
      showDate: false,
    });
    return timeline;
  }
}
