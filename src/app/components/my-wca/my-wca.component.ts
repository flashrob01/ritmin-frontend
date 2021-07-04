import { Component, Input, OnInit } from '@angular/core';
import { WCA } from 'src/app/models/wca';

@Component({
  selector: 'app-my-wca',
  templateUrl: './my-wca.component.html',
  styleUrls: ['./my-wca.component.scss']
})
export class MyWcaComponent implements OnInit {

  @Input() wcas: WCA[];
  @Input() address: string;

  constructor() { }

  ngOnInit(): void {
    this.wcas = this.wcas.filter(wca => wca.creator === this.address);
  }

  public getStatusTag(status: string): string {
    switch(status) {
      case "PENDING": return "warning";
      case "OPEN": return "success";
      case "ACTIVE": return "info";
      case "FINISHED": return "danger"
    }
  }

}
