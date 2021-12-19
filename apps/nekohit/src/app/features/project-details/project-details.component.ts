import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RxState } from '@rx-angular/state';
import { map, switchMap } from 'rxjs/operators';
import { NekohitProjectService } from '../../core/services/project.service';
import { NekoHitProject } from '../../shared/models/project.model';

interface ProjectDetailsState {
  project: NekoHitProject;
}

@Component({
  selector: 'ritmin-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
  providers: [RxState],
})
export class ProjectDetailsComponent {
  state$ = this.state.select();

  loadProject$ = this.route.params.pipe(
    switchMap((param) =>
      this.projectService
        .getProject(decodeURIComponent(param.id))
        .pipe(map((project) => this.mapChartDataToProject(project)))
    )
  );

  constructor(
    private state: RxState<ProjectDetailsState>,
    private route: ActivatedRoute,
    private projectService: NekohitProjectService
  ) {
    this.state.connect('project', this.loadProject$);
  }

  private mapChartDataToProject(project: NekoHitProject): NekoHitProject {
    const data = {
      labels: ['Remaining', 'Funded'],
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
