import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { Milestone } from 'src/app/models/milestone';
import { WalletConnectService } from 'src/app/services/walletconnect.service';
import { WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  milestones: Milestone[];
  basicInfo: any;
  isLoading = false;
  created = false;

  constructor(private router: Router, private wcaService: WcaService, private wallet: WalletConnectService,
    private messageService: MessageService) {
    this.basicInfo = this.router?.getCurrentNavigation()?.extras?.state?.basicInformation;
    this.milestones = this.router?.getCurrentNavigation()?.extras?.state?.ms;

    if (!this.basicInfo || !this.milestones) {
      this.router.navigate(['']);
    }
    const thresholdIndex = this.milestones.indexOf(this.milestones.filter(m => m['isThreshold'] === true)[0]);
    this.basicInfo.thresholdMilestoneIndex = thresholdIndex;
  }

  ngOnInit(): void {}

  onComplete() {
    this.isLoading = true;
    this.wcaService.createWCA(
      {
        hash: this.wallet.address$.getValue(),
        wcaDescription: this.basicInfo.description,
        coolDownInterval: this.basicInfo.cooldownInterval,
        msTitles: this.milestones.map(m => m.title),
        msDescriptions: this.milestones.map(m => m.description),
        endTimestamps: this.milestones.map(m => m.endTimestamp.getTime()),
        identifier: this.basicInfo.identifier,
        maxTokenSoldCount: this.basicInfo.maxTokenSoldCount,
        stakePer100Token: this.basicInfo.stakePerToken * 100,
        thresholdIndex: this.basicInfo.thresholdMilestoneIndex,
        isPublic: this.basicInfo.isPublic
      }).pipe(finalize(() => this.isLoading = false)).subscribe(r => {
        if(r['error']) {
          const message = r['error'].message;
          this.messageService.add({severity: 'error', summary: 'Error', detail: message});
        } else {
          this.created = true;
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Your WCA has been created!'});
        }
      });
  }

  onBefore() {
    this.router.navigate(['new/ms-info'], { state: { basicInformation: this.basicInfo, ms: this.milestones } });
  }

  getIndex(timestamp: Date): number {
    return this.milestones.indexOf(this.milestones.filter(m => m.endTimestamp === timestamp)[0]);
  }

}
