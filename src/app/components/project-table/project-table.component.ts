import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Project} from 'src/app/models/project-models';
import {getStatusTag} from 'src/app/utils';

@Component({
  selector: 'app-project-table',
  templateUrl: './project-table.component.html',
  styleUrls: ['./project-table.component.scss']
})
export class ProjectTableComponent implements OnInit, OnChanges {

  @Input() projects: Project[] = [];
  progressMap: Map<string, number> = new Map();
  isLoading = true;
  getStatusTag = getStatusTag;

  constructor() {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    // tslint:disable-next-line:no-string-literal
    if (changes['projects'] && !changes['projects'].firstChange) {
      this.isLoading = false;
    }
  }

  getProgress(project: Project): number {
    if (project.status === 'FINISHED') {
      return 100;
    } else if (project.status === 'PENDING') {
      return 0;
    } else {
      // ONGOING, count milestones
      const past = project.milestones
        .map((ms, i) => ({index: i, end: ms.endTimestamp}))
        .filter(ms => ms.end <= new Date() || ms.index < project.nextMilestone);
      return Number((past.length / project.milestones.length * 100).toFixed(2));
    }
  }

}
