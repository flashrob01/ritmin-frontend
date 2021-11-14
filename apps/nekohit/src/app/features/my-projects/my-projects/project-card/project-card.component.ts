import { Component, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';
import { NekoHitProject } from 'apps/nekohit/src/app/shared/models/project.model';
import { CountdownConfig } from 'ngx-countdown';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ProjectCardState {
  project: NekoHitProject;
  countdownConfig: CountdownConfig;
}

const CountdownTimeUnits: Array<[string, number]> = [
  ['Y', 1000 * 60 * 60 * 24 * 365], // years
  ['M', 1000 * 60 * 60 * 24 * 30], // months
  ['D', 1000 * 60 * 60 * 24], // days
  ['H', 1000 * 60 * 60], // hours
  ['m', 1000 * 60], // minutes
  ['s', 1000], // seconds
  ['S', 1], // million seconds
];

@Component({
  selector: 'ritmin-project-card',
  templateUrl: './project-card.component.html',
  styleUrls: ['./project-card.component.scss'],
  providers: [RxState],
})
export class ProjectCardComponent {
  state$ = this.state.select();
  now = new Date().getTime();

  getTimeLeft$: Observable<CountdownConfig> = this.state.select('project').pipe(
    map((project) => ({
      formatDate: ({ date, formatStr }) => {
        let duration = Number(date || 0);

        return CountdownTimeUnits.reduce((current, [name, unit]) => {
          if (current.indexOf(name) !== -1) {
            const v = Math.floor(duration / unit);
            duration -= v * unit;
            return current.replace(
              new RegExp(`${name}+`, 'g'),
              (match: string) => {
                return v.toString().padStart(match.length, '0');
              }
            );
          }
          return current;
        }, formatStr);
      },
      leftTime:
        (project.milestones[project.nextMilestone].endTimestamp.getTime() -
          new Date().getTime()) /
        1000,
    }))
  );

  @Input() set project(project: NekoHitProject) {
    this.state.set({ project });
  }

  constructor(private state: RxState<ProjectCardState>) {
    this.state.connect('countdownConfig', this.getTimeLeft$);
  }
}
