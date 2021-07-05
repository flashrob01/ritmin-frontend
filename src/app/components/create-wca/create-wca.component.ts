import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { WalletConnectService } from 'src/app/services/walletconnect.service';
import { WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-create-wca',
  templateUrl: './create-wca.component.html',
  styleUrls: ['./create-wca.component.scss']
})
export class CreateWcaComponent implements OnInit {

  form: FormGroup;

  constructor(
    private readonly fb: FormBuilder,
    private readonly wcaService: WcaService,
    private readonly wallet: WalletConnectService,
    private readonly messageService: MessageService) { }

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
  }

  onSubmit() {
    console.log( this.form.get('isPublic').value);
    this.wcaService.createWCA(
      {
        hash: this.wallet.address$.getValue(),
        wcaDescription: this.form.get('description').value,
        coolDownInterval: this.form.get('description').value,
        msTitles: ["asdf", "dd", "aaa"],
        msDescriptions: ["asdf", "asdfff", "dddd"],
        endTimestamps: [1656855948000, 1659534348000, 1662212748000],
        identifier: this.form.get('identifier').value,
        maxTokenSoldCount: this.form.get('maxTokenSoldCount').value,
        stakePer100Token: this.form.get('stakePerToken').value,
        thresholdIndex: this.form.get('thresholdIndex').value,
        isPublic: this.form.get('isPublic').value,
      }).subscribe(res => {
        console.log(res);
        this.messageService.add({severity:'success', summary:'Success', detail:'Your WCA has been created'});
      });
  }

}
