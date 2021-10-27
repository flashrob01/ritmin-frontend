import { Component, OnInit } from '@angular/core';
import { NekoHitProject } from '../../shared/models/project.model';

interface ProjectTimeline {
  date?: Date;
  text: string;
}

interface RiskLevel {
  text: string;
  color: string;
  icon: string;
}
@Component({
  selector: 'ritmin-project-monitor',
  templateUrl: './project-monitor.component.html',
  styleUrls: ['./project-monitor.component.scss'],
})
export class ProjectMonitorComponent implements OnInit {
  projects: NekoHitProject[] = [
    {
      identifier: 'test',
      description:
        'This is a long description and I am just making up some filler words now I am out of ideas what to write lets just write more.',
      maxTokenSoldCount: 1_000_000,
      remainTokenCount: 450_000,
      stakePer100Token: 22,
      buyerCount: 12112,
      creationTimestamp: new Date(),
      status: 'OPEN',
      coolDownInterval: 1,
      creator: '',
      isPublic: true,
      lastUpdateTimestamp: new Date(),
      milestonesCount: 3,
      nextMilestone: 1,
      stage: '',
      thresholdMilestoneIndex: 2,
      milestones: [
        {
          description: '',
          linkToResult: '',
          title: 'dsfsdf',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: '',
          linkToResult: '',
          title: 'ccc',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: '',
          linkToResult: '',
          title: 'aaa',
          endTimestamp: new Date(2022, 3, 5),
        },
      ],
    },
    {
      identifier: 'xxx',
      description:
        'This is a long description and I am just making up some filler words now I am out of ideas what to write lets just write more.',
      maxTokenSoldCount: 16_380_000,
      remainTokenCount: 150_000,
      stakePer100Token: 100,
      creationTimestamp: new Date(),
      status: 'OPEN',
      buyerCount: 1,
      coolDownInterval: 1,
      creator: '',
      isPublic: true,
      lastUpdateTimestamp: new Date(),
      milestonesCount: 3,
      nextMilestone: 1,
      stage: '',
      thresholdMilestoneIndex: 2,
      milestones: [
        {
          description: '',
          linkToResult: '',
          title: 'sdfsdf',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: '',
          linkToResult: '',
          title: 'fsdfasfd',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: '',
          linkToResult: '',
          title: 'asdfasfd',
          endTimestamp: new Date(2022, 12, 5),
        },
      ],
    },
    {
      identifier: 'xxx',
      description:
        'This is a long description and I am just making up some filler words now I am out of ideas what to write lets just write more.',
      maxTokenSoldCount: 16_380_000,
      remainTokenCount: 0,
      stakePer100Token: 100,
      creationTimestamp: new Date(),
      buyerCount: 55,
      status: 'OPEN',
      coolDownInterval: 1,
      creator: '',
      isPublic: true,
      lastUpdateTimestamp: new Date(),
      milestonesCount: 3,
      nextMilestone: 1,
      stage: '',
      thresholdMilestoneIndex: 2,
      milestones: [
        {
          description: '',
          linkToResult: '',
          title: 'ffff',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: '',
          linkToResult: '',
          title: 'adsfasdfasdfas',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: '',
          linkToResult: '',
          title: 'asdf',
          endTimestamp: new Date(2022, 12, 5),
        },
      ],
    },
    {
      identifier: 'xxx',
      description:
        'This is a long description and I am just making up some filler words now I am out of ideas what to write lets just write more.',
      maxTokenSoldCount: 16_380_000,
      remainTokenCount: 150_000,
      stakePer100Token: 100,
      buyerCount: 1211,
      creationTimestamp: new Date(),
      status: 'OPEN',
      coolDownInterval: 1,
      creator: '',
      isPublic: true,
      lastUpdateTimestamp: new Date(),
      milestonesCount: 3,
      nextMilestone: 1,
      stage: '',
      thresholdMilestoneIndex: 2,
      milestones: [
        {
          description: '',
          linkToResult: '',
          title: 'finish abc',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: '',
          linkToResult: '',
          title: 'finish y',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: '',
          linkToResult: '',
          title: 'finish x',
          endTimestamp: new Date(2022, 12, 5),
        },
      ],
    },
  ];

  public getProjectTimeline(project: NekoHitProject): ProjectTimeline[] {
    const timeline: ProjectTimeline[] = [];
    timeline.push({ date: project.creationTimestamp, text: 'Start' });
    timeline.push(
      ...project.milestones.map((ms) => ({
        date: ms.endTimestamp,
        text: ms.title,
      }))
    );
    timeline.push({ text: 'End' });
    return timeline;
  }

  public getRiskLevelForProject(project: NekoHitProject): RiskLevel {
    if (project.stakePer100Token < 10) {
      return {
        text: 'very high risk',
        color: 'darkred',
        icon: 'pi pi-angle-double-down',
      };
    } else if (project.stakePer100Token <= 30) {
      return {
        text: 'high risk',
        color: 'red',
        icon: 'pi pi-angle-double-down',
      };
    } else if (project.stakePer100Token <= 50) {
      return {
        text: 'moderate risk',
        color: 'darkred',
        icon: 'pi pi-angle-double-down',
      };
    } else if (project.stakePer100Token <= 75) {
      return {
        text: 'low risk',
        color: 'darkred',
        icon: 'pi pi-angle-double-down',
      };
    } else if (project.stakePer100Token <= 100) {
      return {
        text: 'very low risk',
        color: 'darkred',
        icon: 'pi pi-angle-double-down',
      };
    } else
      return {
        text: 'no risk',
        color: 'darkred',
        icon: 'pi pi-angle-double-down',
      };
  }

  constructor() {}

  ngOnInit(): void {}
}
