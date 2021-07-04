import { Component, Input, OnInit } from '@angular/core';
import { WCA } from 'src/app/models/wca';
import { getStatusTag } from 'src/app/utils';

@Component({
  selector: 'app-my-wca',
  templateUrl: './my-wca.component.html',
  styleUrls: ['./my-wca.component.scss']
})
export class MyWcaComponent implements OnInit {

  @Input() wcas: WCA[];
  @Input() address: string;
  getStatusTag = getStatusTag;

  constructor() { }

  ngOnInit(): void {
    this.wcas = this.wcas.filter(wca => wca.creator === this.address);
  }

}
