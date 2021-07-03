import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WCA } from 'src/app/models/wca';

@Component({
  selector: 'app-wca-table',
  templateUrl: './wca-table.component.html',
  styleUrls: ['./wca-table.component.scss']
})
export class WcaTableComponent implements OnInit, OnChanges {

  @Input() wcas: WCA[] = [];
  isLoading = true;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wcas'] && !changes['wcas'].firstChange) {
      this.isLoading = false;
    }
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
