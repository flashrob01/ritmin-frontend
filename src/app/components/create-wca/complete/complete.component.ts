import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Milestone } from 'src/app/models/milestone';
import { WCA } from 'src/app/models/wca';
import { WalletConnectService } from 'src/app/services/walletconnect.service';
import { WcaService } from 'src/app/services/wca.service';

@Component({
  selector: 'app-complete',
  templateUrl: './complete.component.html',
  styleUrls: ['./complete.component.scss']
})
export class CompleteComponent implements OnInit {

  milestones: Milestone[];
  basicInfo: WCA;

  constructor(private router: Router, private wcaService: WcaService, private wallet: WalletConnectService) {
    this.basicInfo = this.router?.getCurrentNavigation()?.extras?.state?.basicInformation;
    this.milestones = this.router?.getCurrentNavigation()?.extras?.state?.ms;

    if (!this.basicInfo || !this.milestones) {
      this.router.navigate(['']);
    }
  }

  ngOnInit(): void {}

  onComplete() {
    this.wcaService.createWCA(
      {
        hash: this.wallet.address$.getValue(),
        wcaDescription: this.basicInfo.description,
        coolDownInterval: this.basicInfo.coolDownInterval,
        msTitles: this.milestones.map(m => m.title),
        msDescriptions: this.milestones.map(m => m.description),
        endTimestamps: this.milestones.map(m => m.endTimestamp.getTime()),
        identifier: this.basicInfo.identifier,
        maxTokenSoldCount: this.basicInfo.maxTokenSoldCount,
        stakePer100Token: this.basicInfo.stakePer100Token,
        thresholdIndex: this.basicInfo.thresholdMilestoneIndex,
        isPublic: this.basicInfo.isPublic
      }).subscribe(r => console.log(r));
  }

  onBefore() {
    //this.router.navigate(['new/basic-info'], { state: { basicInformation: this.lastForm } });
  }

}
