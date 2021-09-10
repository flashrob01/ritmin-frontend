import { Component, OnInit } from '@angular/core';
import { LinkService } from './core/services/link.service';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  title = 'nekohit';
  showPromotion = true;

  constructor(public linkService: LinkService) {}

  ngOnInit() {}

}
