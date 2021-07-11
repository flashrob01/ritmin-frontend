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
  minDate = new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()+1);

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private messageService: MessageService) {
    this.lastForm = this.router.getCurrentNavigation()?.extras?.state?.basicInformation;
    const saved = this.router?.getCurrentNavigation()?.extras?.state?.ms;
    if (saved) {
      this.milestones = saved;
    }

    if (!this.lastForm) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      endTimestamp: [this.minDate, Validators.required]
    });
  }

  onAdd() {
    const ms = this.form.getRawValue();
    if( this.milestones.filter(m => m.endTimestamp === ms.endTimestamp)[0]) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Another miletone already ends on this date'});
      return;
    }
    if (this.form.get('title').value.length > 30) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Title cannot be longer than 30 characters'});
      return;
    }
    if (this.form.get('description').value.length > 400) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Description cannot be longer than 400 characters'});
      return;
    }
    this.milestones.push(ms);
    this.milestones.sort((a,b)=>a.endTimestamp.getTime()-b.endTimestamp.getTime());
  }

  onNext() {
    const hasThreshold = !!this.milestones.filter(m => m['isThreshold'] === true).length;
    if(!hasThreshold) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'You need to select a threshold milestone'});
    } else {
      this.router.navigate(['new/complete'], { state: { ms: this.milestones, basicInformation: this.lastForm } });
    }
  }

  onBefore() {
    this.router.navigate(['new/wca'], { state: { basicInformation: this.lastForm } });
  }

  getIndex(timestamp: Date): number {
    return this.milestones.indexOf(this.milestones.filter(m => m.endTimestamp === timestamp)[0]);
  }

  onRemove(ms: Milestone) {
    const index = this.milestones.indexOf(this.milestones.filter(m => m.endTimestamp === ms.endTimestamp)[0]);
    this.milestones.splice(index, 1);
  }

  setThreshhold(ms: Milestone) {
    const index = this.milestones.indexOf(this.milestones.filter(m => m.endTimestamp === ms.endTimestamp)[0]);
    this.milestones.forEach(m => m['isThreshold'] = false);
    this.milestones[index]['isThreshold'] = true;
  }


  get title(): string {
    return this.form.get('title').value;
  }

  get description(): string {
    return this.form.get('description').value;
  }


}
