import { Component, Inject } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { DialogService } from 'primeng/dynamicdialog';
import { NekohitProjectService } from '../../../core/services/project.service';
import { CreateProjectComponent } from '../../../create-project/create-project.component';
import { GlobalState, GLOBAL_RX_STATE } from '../../../global.state';
import { NekoHitProject } from '../../../shared/models/project.model';

interface MyProjectsState {
  projects: NekoHitProject[];
}

const initState: MyProjectsState = {
  projects: [],
};

@Component({
  selector: 'ritmin-my-stakings',
  templateUrl: './my-stakings.component.html',
  styleUrls: ['./my-stakings.component.scss'],
  providers: [RxState, DialogService],
})
export class MyStakingsComponent {
  state$ = this.state.select();

  constructor(
    private state: RxState<MyProjectsState>,
    private projectService: NekohitProjectService,
    private dialogService: DialogService,
    @Inject(GLOBAL_RX_STATE) private globalState: RxState<GlobalState>
  ) {
    this.state.set(initState);
    this.state.connect(
      'projects',
      this.projectService.getProjects({
        supporter: this.globalState.get('address'),
      })
    );
  }

  createProject(): void {
    this.dialogService.open(CreateProjectComponent, {
      header: 'Create a new project',
      width: '80%',
    });
  }
}
