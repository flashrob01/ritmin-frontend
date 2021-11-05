import { Component, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import multiavatar from '@multiavatar/multiavatar';
import { NekoHitProject } from '../../shared/models/project.model';
import { map } from 'rxjs/operators';

interface FeaturedProjectState {
  project: NekoHitProject;
  svg: string;
}

@Component({
  selector: 'ritmin-featured-project',
  templateUrl: './featured-project.component.html',
  styleUrls: ['./featured-project.component.scss'],
  providers: [RxState],
})
export class FeaturedProjectComponent {
  state$ = this.state.select();

  readonly getSVG$ = this.state
    .select('project')
    .pipe(map((project) => multiavatar(project.creator)));

  @Input() set project(project: NekoHitProject) {
    this.state.set({ project });
  }
  constructor(private state: RxState<FeaturedProjectState>) {
    this.state.connect('svg', this.getSVG$);
  }
}
