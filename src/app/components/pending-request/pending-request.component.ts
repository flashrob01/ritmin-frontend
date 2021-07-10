import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-pending-request',
  templateUrl: './pending-request.component.html',
  styleUrls: ['./pending-request.component.scss']
})
export class PendingRequestComponent implements OnInit {

  @Input() header = 'Pending Request'
  @Input() display = false;

  constructor() { }

  ngOnInit(): void {
  }

}
