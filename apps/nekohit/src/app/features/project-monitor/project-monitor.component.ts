import { Component, Inject } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { map } from 'rxjs/operators';
import { NekohitProjectService } from '../../core/services/project.service';
import { GlobalState, GLOBAL_RX_STATE } from '../../global.state';
import { NekoHitProject } from '../../shared/models/project.model';

interface ProjectTimeline {
  date: Date;
  text: string;
  subtext?: string;
  color: string;
  showDate: boolean;
  borderColor?: string;
  class?: string;
}

interface ProjectMonitorState {
  projects: NekoHitProject[];
}

@Component({
  selector: 'ritmin-project-monitor',
  templateUrl: './project-monitor.component.html',
  styleUrls: ['./project-monitor.component.scss'],
  providers: [RxState],
})
export class ProjectMonitorComponent {
  state$ = this.state.select();
  readonly address$ = this.globalState.select('address');
  readonly catBalance$ = this.globalState.select('catBalance');

  // TODO: should be improved (more clean etc)
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

  constructor(
    private state: RxState<ProjectMonitorState>,
    private projectService: NekohitProjectService,
    @Inject(GLOBAL_RX_STATE) public globalState: RxState<GlobalState>
  ) {
    this.state.connect(
      'projects',
      this.projectService
        .getProjects()
        .pipe(
          map((p) =>
            p
              .filter((p) => p.status !== 'PENDING' && p.status !== 'UNKNOWN')
              .map((p) => this.mapChartDataToProject(p))
          )
        )
    );
  }

  public getStakeValue(project: NekoHitProject, multiplier: number): number {
    const availableBalance = this.globalState.get('catBalance');
    const stakeAmount = availableBalance * multiplier;
    return stakeAmount > project.remainTokenCount
      ? project.remainTokenCount
      : stakeAmount;
  }

  private mapChartDataToProject(project: NekoHitProject): NekoHitProject {
    const data = {
      labels: ['Remaining', 'Staked'],
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
}
