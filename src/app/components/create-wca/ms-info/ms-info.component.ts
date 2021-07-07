import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Milestone } from 'src/app/models/milestone';

@Component({
  selector: 'app-ms-info',
  templateUrl: './ms-info.component.html',
  styleUrls: ['./ms-info.component.scss']
})
export class MsInfoComponent implements OnInit {

  form: FormGroup;
  lastForm: any;
  milestones: Milestone[] = [];

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService) {
    this.lastForm = this.router.getCurrentNavigation()?.extras?.state?.basicInformation;
    if (!this.lastForm) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      endTimestamp: [new Date(), Validators.required]
    });
  }

  onAdd() {
    const ms = this.form.getRawValue();
    if( this.milestones.filter(m => m.endTimestamp === ms.endTimestamp)[0]) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Another miletone already ends on this date'});
      return;
    }
    this.milestones.push(ms);
    this.milestones.sort((a,b)=>a.endTimestamp.getTime()-b.endTimestamp.getTime());
  }

  onNext() {
    this.router.navigate(['new/complete'], { state: { ms: this.milestones, basicInformation: this.lastForm } });
  }

  onBefore() {
    this.router.navigate(['new/basic-info'], { state: { basicInformation: this.lastForm } });
  }

  getIndex(timestamp: Date): number {
    return this.milestones.indexOf(this.milestones.filter(m => m.endTimestamp === timestamp)[0]);
  }

  onRemove(ms: Milestone) {
    const index = this.milestones.indexOf(this.milestones.filter(m => m.endTimestamp === ms.endTimestamp)[0]);
    this.milestones.splice(index, 1);
  }


}
