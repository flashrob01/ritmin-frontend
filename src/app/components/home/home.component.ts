import {Component, OnInit} from '@angular/core';
import {Project} from 'src/app/models/project-models';
import {AdvanceQueryReqBody, WcaService} from 'src/app/services/wca.service';
import {NeolineService} from '../../services/neoline.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  projects: Project[] = [];

  constructor(
    private readonly wcaService: WcaService,
  ) {
    NeolineService.onChangeSubject.subscribe(() => {
      this.refreshData();
    });
  }

  ngOnInit(): void {
    this.refreshData();
  }

  refreshData(): void {
    // TODO what if we have thousand of project?
    const defaultQuery: AdvanceQueryReqBody = {
      creator: null,
      buyer: null,
      page: 1,
      size: 100,
    };
    this.wcaService.filterProjects(defaultQuery).subscribe(res => {
      this.projects = res;
    });
  }
}
