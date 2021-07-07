import { Component } from '@angular/core';
import { MenuItem } from 'primeng/api';


@Component({
  selector: 'app-create-wca',
  templateUrl: './create-wca.component.html',
  styleUrls: ['./create-wca.component.scss']
})
export class CreateWcaComponent {

  activeIndex: number = 0;
  items: MenuItem[] = [
    {label: 'Informations', routerLink: 'basic-info'},
    {label: 'Milestones', routerLink: 'ms-info'},
    {label: 'Create'}
  ];

}
