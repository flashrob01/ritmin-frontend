import { Component, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { FeaturedProject } from './featured-project.service';

const initState = {
  id: '',
  title: '',
  description: '',
  image: '',
  subtitle: '',
};
@Component({
  selector: 'ritmin-featured-project',
  templateUrl: './featured-project.component.html',
  styleUrls: ['./featured-project.component.scss'],
  providers: [RxState],
})
export class FeaturedProjectComponent {
  state$ = this.state.select();

  @Input() set project(project: FeaturedProject) {
    this.state.set(project);
  }
  constructor(private state: RxState<FeaturedProject>) {
    this.state.set(initState);
  }
}
