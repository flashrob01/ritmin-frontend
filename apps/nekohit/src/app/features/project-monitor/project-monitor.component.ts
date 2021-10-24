import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'ritmin-project-monitor',
  templateUrl: './project-monitor.component.html',
  styleUrls: ['./project-monitor.component.scss']
})
export class ProjectMonitorComponent implements OnInit {

  // important bits: progress, description, milestones, cta, staking info, status
  projects: any[] = [
    {
      id: 'test',
      text: 'lorem ipsum',
      progress: 88,
      description:"This is a long description and I am just making up some filler words now I am out of ideas what to write lets just write more."
    },
    {
      id: 'xxx',
      text: 'lorem ipsum',
      progress: 2,
      description:"This is a long description and I am just making up some filler words now I am out of ideas what to write lets just write more."
    }];

  constructor() { }

  ngOnInit(): void {
  }

}
