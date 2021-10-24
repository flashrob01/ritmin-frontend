import { Component, OnInit } from '@angular/core';
import { NekoHitProject } from '../../shared/models/project.model';

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
      creationTimestamp: new Date(),
      status: 'OPEN',
      milestones: [
        {
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          endTimestamp: new Date(2022, 1, 12),
        },
        {
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
      milestones: [
        {
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          endTimestamp: new Date(2022, 1, 12),
        },
        {
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
      status: 'OPEN',
      milestones: [
        {
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          endTimestamp: new Date(2022, 1, 12),
        },
        {
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
      creationTimestamp: new Date(),
      status: 'OPEN',
      milestones: [
        {
          endTimestamp: new Date(2021, 11, 11),
        },
        {
          endTimestamp: new Date(2022, 1, 12),
        },
        {
          endTimestamp: new Date(2022, 12, 5),
        },
      ],
    },
  ];

  constructor() {}

  ngOnInit(): void {}
}
