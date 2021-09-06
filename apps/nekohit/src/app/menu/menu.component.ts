import { Component, OnInit } from '@angular/core';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'ritmin-frontend-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  items: MenuItem[] = [];

  ngOnInit() {
    this.items = [{
        label: 'File',
        items: [
            {label: 'New'},
            {label: 'Open'}
        ]
    },
    {
        label: 'Edit',
        items: [
            {label: 'Undo'},
            {label: 'Redo'}
        ]
    }];
}

}
