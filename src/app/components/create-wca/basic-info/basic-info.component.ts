import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

  form: FormGroup;
  savedForm: any;

  constructor(private fb: FormBuilder, private router: Router, private messageService: MessageService) {
    this.savedForm = this.router.getCurrentNavigation()?.extras?.state?.basicInformation;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      identifier: ['', Validators.required],
      description: ['', Validators.required],
      cooldownInterval: [1, Validators.required],
      maxTokenSoldCount: [1, Validators.required],
      stakePerToken: [1, Validators.required],
      isPublic: [true],
    });
    if (this.savedForm) {
      this.form.patchValue(this.savedForm);
    }
  }

  onNext() {
    if (this.form.get('stakePerToken').value < 1) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Stake/Token must be a value greater than 1'});
      return;
    }
    if (this.form.get('maxTokenSoldCount').value <= 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Tokens to sell must be a positive value'});
      return;
    }
    if (this.form.get('cooldownInterval').value <= 0) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Cooldown interval must be a positive value'});
      return;
    }
    if (this.form.get('identifier').value.length > 40) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Identifier cannot be longer than 40 characters'});
      return;
    }
    if (this.form.get('description').value.length > 400) {
      this.messageService.add({severity: 'error', summary: 'Error', detail: 'Description cannot be longer than 400 characters'});
      return;
    }
    this.router.navigate(['new/ms-info'], { state: { basicInformation: this.form.getRawValue() } });
  }

}
