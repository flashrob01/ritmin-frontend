import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-basic-info',
  templateUrl: './basic-info.component.html',
  styleUrls: ['./basic-info.component.scss']
})
export class BasicInfoComponent implements OnInit {

  form: FormGroup;
  savedForm: any;

  constructor(private fb: FormBuilder, private router: Router) {
    this.savedForm = this.router.getCurrentNavigation()?.extras?.state?.basicInformation;
  }

  ngOnInit(): void {
    this.form = this.fb.group({
      identifier: ['', Validators.required],
      description: ['', Validators.required],
      cooldownInterval: [0, Validators.required],
      maxTokenSoldCount: [0, Validators.required],
      stakePerToken: [0, Validators.required],
      thresholdIndex: [0, Validators.required],
      isPublic: [false],
    });
    if (this.savedForm) {
      this.form.patchValue(this.savedForm);
    }

  }

  onNext() {
    this.router.navigate(['new/ms-info'], { state: { basicInformation: this.form.getRawValue() } });
  }

}
