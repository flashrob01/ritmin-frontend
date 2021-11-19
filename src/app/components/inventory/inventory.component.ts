import {Component, OnInit} from '@angular/core';
import {Project} from 'src/app/models/project-models';
import {AdvanceQueryReqBody, WcaService} from 'src/app/services/wca.service';
import {getStatusTag} from 'src/app/utils';
import {NeolineService} from '../../services/neoline.service';

@Component({
  selector: 'app-inventory',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {

  boughtProjects: Project[] = [];
  createdProjects: Project[] = [];
  getStatusTag = getStatusTag;

  constructor(
    private wcaService: WcaService,
    private wallet: NeolineService
  ) {
  }

  ngOnInit(): void {
    const createdProjectQuery: AdvanceQueryReqBody = {
      tokenHash: null,
      creator: this.wallet.getAddress$().getValue(),
      buyer: null,
      page: 1,
      size: 100,
    };
    this.wcaService.filterProjects(createdProjectQuery).subscribe(res => {
      this.createdProjects = res;

    });

    const boughtProjectQuery: AdvanceQueryReqBody = {
      tokenHash: null,
      creator: null,
      buyer: this.wallet.getAddress$().getValue(),
      page: 1,
      size: 100,
    };
    this.wcaService.filterProjects(boughtProjectQuery).subscribe(res => {
      this.boughtProjects = res;

    });

  }

}
