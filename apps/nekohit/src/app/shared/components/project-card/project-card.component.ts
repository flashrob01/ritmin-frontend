import { Component, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { NekoHitProject } from '../../models/project.model';

interface ProjectCardState {
  project: NekoHitProject;
}

@Component({
  selector: 'ritmin-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  providers: [RxState],
})
export class ProjectCardComponent {
  state$ = this.state.select();
  now = new Date().getTime();
  encode = encodeURIComponent;

  @Input() set project(project: NekoHitProject) {
    this.state.set({ project });
  }

  constructor(private state: RxState<ProjectCardState>) {}
}
