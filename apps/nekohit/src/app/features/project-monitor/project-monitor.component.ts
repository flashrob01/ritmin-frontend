import { Component, OnInit } from '@angular/core';
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
          description:
            'Some description to the milestone. Some description to the milestone',
          linkToResult: '',
          title: 'dsfsdf',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'ccc',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'aaa',
          endTimestamp: new Date(2022, 3, 5),
        },
        {
          description:
            'Some description to the milestone. Some description to the milestone',
          linkToResult: '',
          title: 'dsfsdf',
          endTimestamp: new Date(2022, 4, 5),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'ccc',
          endTimestamp: new Date(2022, 5, 5),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'aaa',
          endTimestamp: new Date(2022, 6, 5),
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
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'sdfsdf',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'fsdfasfd',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: 'Some description to the milestone',
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
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'ffff',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'adsfasdfasdfas',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: 'Some description to the milestone',
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
          description:
            'Some description to the milestone. Some description to the milestone',
          linkToResult: '',
          title: 'finish abc',
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'finish y',
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          description: 'Some description to the milestone',
          linkToResult: '',
          title: 'finish x',
          endTimestamp: new Date(2022, 12, 5),
        },
      ],
    },
  ];

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

    const totalMilestones = project.milestones.length;
    timeline.forEach((tl, i) => {
      if (i >= project.thresholdMilestoneIndex) {
        const remainingMs = totalMilestones - i - 1;
        const result = (remainingMs / totalMilestones) * 100;
        const rounded = Math.round(result * 100) / 100;
        tl.subtext = String(rounded + '% refund');
      }
    });

    /* add a marker for current status */
    const currentLabel = 'Current Status';
    const nextMilestoneDate =
      timeline[project.nextMilestone].date?.getTime() - 1;
    timeline.push({
      text: currentLabel,
      date: new Date(nextMilestoneDate),
      color: '#00e599',
      borderColor: '#00e599',
      class: 'timeline-event-marker',
      showDate: false,
    });
    timeline.sort(function compare(a, b) {
      const dateA = new Date(a.date || new Date());
      const dateB = new Date(b.date || new Date());
      return dateA.getTime() - dateB.getTime();
    });

    /* add end to timeline */
    timeline.push({
      text: 'End',
      color: 'white',
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

  constructor() {}

  ngOnInit(): void {}
}
