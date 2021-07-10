import {Component, OnInit} from '@angular/core';
import {WCA} from '../../models/wca';
import {WcaService} from '../../services/wca.service';
import {ActivatedRoute} from '@angular/router';
import {WalletConnectService} from '../../services/walletconnect.service';
import {wallet} from '@cityofzion/neon-js';
import { ConfirmationService, MessageService } from 'primeng/api';
import { getStatusTag } from 'src/app/utils';
import { Milestone } from 'src/app/models/milestone';

@Component({
  selector: 'app-wca-detail',
  templateUrl: './wca-detail.component.html',
  styleUrls: ['./wca-detail.component.scss'],
  providers: [ConfirmationService]
})
export class WcaDetailComponent implements OnInit {
  wca: WCA | null = null;
  purchasedAmount = 0;
  isOwner = false;
  now = new Date();
  displayPurchase = false;
  displayUpdate = false;
  purchaseAmount: number;
  displayPendingRequest = false;
  isLoading = false;
  updatableMilestones: { index: number, title: string, endTime: Date }[] = [];
  selectedMilestones: { index: number, title: string, endTime: Date };
  updateContent: string;
  getStatusTag = getStatusTag;

  constructor(
    private route: ActivatedRoute,
    private readonly wcaService: WcaService,
    public readonly walletService: WalletConnectService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
  }

  ngOnInit(): void {
    this.route.params.subscribe((param) => {
      const identifier = param.id;
      this.wcaService.queryWCA(identifier).subscribe((result) => {
        this.wca = result;
        this.updatableMilestones = this.wca.milestones
          .map((ms, i) => ({
            index: i,
            title: ms.title,
            endTime: ms.endTimestamp
          }))
          .filter((it) => it.index >= this.wca.nextMilestone)
          .filter((it) => it.endTime > new Date());
        if (this.walletService.address$.getValue() == null) {
          this.walletService.address$.subscribe((address) => {
            this.refreshAddress(address);
          });
        } else {
          this.refreshAddress(this.walletService.address$.getValue());
        }
      });
    });
  }

  refreshAddress(address: string): void {
    if (this.wca != null) {
      this.isOwner = this.wca.creator === address;
      if (address != null && !this.isOwner) {
        this.wcaService.queryPurchase(this.wca.identifier, wallet.getScriptHashFromAddress(address))
          .subscribe((amount) => this.purchasedAmount = amount / 100);
      }
    }
  }

  payStake(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to stake ' + this.wca.stakePer100Token * this.wca.maxTokenSoldCount + ' tokens',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPendingRequest = true;
        this.wcaService.transferCatToken(
          this.walletService.address$.getValue(),
          this.wca.stakePer100Token * this.wca.maxTokenSoldCount * 100,
          this.wca.identifier
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if(r['error']) {
            const message = r['error'].message;
            this.messageService.add({severity: 'error', summary: 'Error', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success', detail: 'Your payment was successful'});
          }
        });
      }
    });
  }

  purchase(): void {
    if (this.walletService.address$.getValue() != null) {
      this.displayPurchase = false;
      this.displayPendingRequest = true;
      this.wcaService.transferCatToken(
        this.walletService.address$.getValue(),
        this.purchaseAmount * 100,
        this.wca.identifier
      ).subscribe((r) => {
        this.displayPendingRequest = false;
        if(r['error']) {
          const message = r['error'].message;
          this.messageService.add({severity: 'error', summary: 'Error', detail: message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Your purchase was successful'});
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot get account address. Please connect your wallet first.'
      });
    }
  }

  getIndex(timestamp: Date): number {
    return this.wca.milestones.indexOf(this.wca.milestones.filter(m => m.endTimestamp === timestamp)[0]);
  }

  getStatusTagForMs(ms: Milestone): string {
    const index = this.wca.nextMilestone;
    if (this.wca.milestones[index] === ms) {
      return 'success';
    }
    if (ms.endTimestamp < this.wca.milestones[index].endTimestamp) {
      return 'warning';
    }
    else return 'info';
  }

  getStatusTextForMs(ms: Milestone): string {
    const index = this.wca.nextMilestone;
    if (this.wca.milestones[index] === ms) {
      return 'ACTIVE';
    }
    if (ms.endTimestamp < this.wca.milestones[index].endTimestamp) {
      return 'FINISHED';
    }
    else return 'TBR';
  }

  getMilestoneRowClass(ms: Milestone): string {
    const index = this.wca.thresholdMilestoneIndex;
    return this.wca.milestones[index] === ms ? 'highlight' : '';

  }

  makeRefund(): void {
   /*  if (this.walletService.address$.getValue() != null) {
      this.isLoading = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Request sent',
        detail: 'Please approve the request in your wallet.'
      });
      this.wcaService.refund(
        this.wca.identifier,
        this.walletService.address$.getValue()
      ).pipe(finalize(() => this.isLoading = false)).subscribe((r) => {
        if (r['error']) {
          const message = r['error'].message;
          this.messageService.add({severity: 'error', summary: 'Error', detail: message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Refund approved!'});
        }
      });
    } else {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Cannot get account address. Please connect your wallet first.'
      });
    } */
  }

  requestFinish(): void {
   /*  this.isLoading = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Request sent',
      detail: 'Please approve the request in your wallet.'
    });
    this.wcaService.finishWCA(
      this.wca.identifier
    ).pipe(finalize(() => this.isLoading = false)).subscribe((r) => {
      if (r['error']) {
        const message = r['error'].message;
        this.messageService.add({severity: 'error', summary: 'Error', detail: message});
      } else {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'WCA is finished!'});
      }
    }); */
  }

  update(): void {
    /* this.isLoading = true;
    this.messageService.add({
      severity: 'success',
      summary: 'Request sent',
      detail: 'Please approve the request in your wallet.'
    });
    this.wcaService.finishMilestone(
      this.wca.identifier,
      this.selectedMilestones.index,
      this.updateContent
    ).pipe(finalize(() => this.isLoading = false)).subscribe((r) => {
      if (r['error']) {
        const message = r['error'].message;
        this.messageService.add({severity: 'error', summary: 'Error', detail: message});
      } else {
        this.messageService.add({severity: 'success', summary: 'Success', detail: 'Update milestone was successful'});
      }
    }); */
  }

}
