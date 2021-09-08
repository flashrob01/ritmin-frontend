import {Component} from '@angular/core';
import {MenuItem} from 'primeng/api';


@Component({
  selector: 'app-declare-project',
  templateUrl: './declare-project.component.html',
  styleUrls: ['./declare-project.component.scss']
})
export class DeclareProjectComponent {

  activeIndex = 0;
  items: MenuItem[] = [
    {label: 'Informations', routerLink: 'project'},
    {label: 'Milestones', routerLink: 'milestones'},
    {label: 'Create'}
  ];

}
