import { Component, Inject } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { NekohitProjectService } from '../../../core/services/project.service';
import { GlobalState, GLOBAL_RX_STATE } from '../../../global.state';
import { NekoHitProject } from '../../../shared/models/project.model';

interface MyProjectsState {
  projects: NekoHitProject[];
}

const initState: MyProjectsState = {
  projects: [],
};

@Component({
  selector: 'ritmin-my-projects',
  templateUrl: './my-projects.component.html',
  styleUrls: ['./my-projects.component.scss'],
  providers: [RxState],
})
export class MyProjectsComponent {
  state$ = this.state.select();

  constructor(
    private state: RxState<MyProjectsState>,
    private projectService: NekohitProjectService,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {
    this.state.set(initState);
    this.state.connect(
      'projects',
      this.projectService.getProjects({
        creator: this.globalState.get('address'),
      })
    );
  }
}
