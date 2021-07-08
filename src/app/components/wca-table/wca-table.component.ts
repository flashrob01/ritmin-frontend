import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { WCA } from 'src/app/models/wca';
import { getStatusTag } from 'src/app/utils';

@Component({
  selector: 'app-wca-table',
  templateUrl: './wca-table.component.html',
  styleUrls: ['./wca-table.component.scss']
})
export class WcaTableComponent implements OnInit, OnChanges {

  @Input() wcas: WCA[] = [];
  progressMap: Map<string, number> = new Map();
  isLoading = true;
  getStatusTag = getStatusTag;

  constructor() { }

  ngOnInit(): void {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['wcas'] && !changes['wcas'].firstChange) {
      this.isLoading = false;

    }
  }

  getProgress(wca: WCA): number {
    const past = wca.milestones.map(ms => new Date(ms.endTimestamp)).filter(end => end < new Date());
    return past.length/wca.milestones.length * 100;
  }

}
