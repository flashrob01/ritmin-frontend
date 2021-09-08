import {Component, OnInit} from '@angular/core';
import {Project} from '../../models/project-models';
import {WcaService} from '../../services/wca.service';
import {ActivatedRoute} from '@angular/router';
import {wallet} from '@cityofzion/neon-js';
import {ConfirmationService, MessageService} from 'primeng/api';
import {getStatusTag} from 'src/app/utils';
import {Milestone} from 'src/app/models/project-models';
import {NeolineService} from '../../services/neoline.service';

@Component({
  selector: 'app-project-detail',
  templateUrl: './project-detail.component.html',
  styleUrls: ['./project-detail.component.scss'],
  providers: [ConfirmationService]
})
export class ProjectDetailComponent implements OnInit {
  project: Project | null = null;
  purchasedAmount = 0;
  isOwner = false;
  now = new Date();
  displayPurchase = false;
  displayUpdate = false;
  purchaseAmount: number;
  displayPendingRequest = false;
  updatableMilestones: { index: number, title: string, endTime: Date }[] = [];
  selectedMilestone: { index: number, title: string, endTime: Date };
  proofLink = '';
  getStatusTag = getStatusTag;

  constructor(
    private route: ActivatedRoute,
    private readonly wcaService: WcaService,
    public readonly walletService: NeolineService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService
  ) {
    NeolineService.onChangeSubject.subscribe(() => {
      this.refresh();
    });
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh(): void {
    this.route.params.subscribe((param) => {
      const identifier = param.id;
      this.wcaService.queryProject(identifier).subscribe((result) => {
        this.project = result;
        this.updatableMilestones = this.project.milestones
          .map((ms, i) => ({
            index: i,
            title: ms.title,
            endTime: ms.endTimestamp
          }))
          .filter((it) => it.index >= this.project.nextMilestone)
          .filter((it) => it.endTime > new Date());
        this.selectedMilestone = this.updatableMilestones[0];
        if (this.walletService.getAddress$().getValue() == null) {
          this.walletService.getAddress$().subscribe((address) => {
            this.refreshAddress(address);
          });
        } else {
          this.refreshAddress(this.walletService.getAddress$().getValue());
        }
      });
    });
  }

  refreshAddress(address: string): void {
    if (this.project != null) {
      this.isOwner = this.project.creator === address;
      if (address != null && !this.isOwner) {
        this.wcaService.queryPurchase(this.project.identifier, wallet.getScriptHashFromAddress(address))
          .subscribe((amount) => this.purchasedAmount = amount / 100);
      }
    }
  }

  getIndex(timestamp: Date): number {
    return this.project.milestones.indexOf(this.project.milestones.filter(m => m.endTimestamp === timestamp)[0]);
  }

  getStatusTagForMs(ms: Milestone): string {
    const index = this.project.nextMilestone;
    if (this.project.milestones[index] === ms) {
      return 'success';
    }
    if (this.project.milestones.indexOf(ms) < index && !ms.linkToResult) {
      return 'warning';
    }
    if (ms.linkToResult != null) {
      return 'danger';
    }
    if (ms.endTimestamp < this.project.milestones[index].endTimestamp) {
      return 'warning';
    } else {
      return 'info';
    }
  }

  getStatusTextForMs(ms: Milestone): string {
    const index = this.project.nextMilestone;
    if (this.project.milestones[index] === ms) {
      return 'ACTIVE';
    }
    if (this.project.milestones.indexOf(ms) < index && !ms.linkToResult) {
      return 'SKIPPED';
    }
    if (ms.linkToResult != null) {
      return 'FINISHED';
    }
    if (ms.endTimestamp < this.project.milestones[index].endTimestamp) {
      return 'EXPIRED';
    } else {
      return 'TODO';
    }
  }

  getMilestoneRowClass(ms: Milestone): string {
    const index = this.project.thresholdMilestoneIndex;
    return this.project.milestones[index] === ms ? 'highlight' : '';
  }

  payStake(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to stake ' + this.project.stakePer100Token * this.project.maxTokenSoldCount + ' tokens',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPendingRequest = true;
        this.wcaService.transferCatToken(
          this.walletService.getAddress$().getValue(),
          this.project.stakePer100Token * this.project.maxTokenSoldCount * 100,
          this.project.identifier
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if (r.error) {
            const message = r.error;
            this.messageService.add({severity: 'error', summary: 'Error: Pay Stake', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success: Pay Stake', detail: 'Your payment was successful'});
          }
        });
      }
    });
  }

  purchase(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to purchase ' + this.purchaseAmount + ' CAT',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPurchase = false;
        this.displayPendingRequest = true;
        this.wcaService.transferCatToken(
          this.walletService.getAddress$().getValue(),
          this.purchaseAmount * 100,
          this.project.identifier
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if (r.error) {
            const message = r.error;
            this.messageService.add({severity: 'error', summary: 'Error: Purchase', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success: Purchase', detail: 'Your purchase was successful'});
          }
        });
      }
    });

  }

  makeRefund(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to refund your purchases',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPendingRequest = true;
        this.wcaService.refund(
          this.project.identifier,
          this.walletService.getAddress$().getValue()
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if (r.error) {
            const message = r.error;
            this.messageService.add({severity: 'error', summary: 'Error: Refund', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success: Refund', detail: 'Your refund has been approved'});
          }
        });
      }
    });

  }

  requestFinish(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to finish this project',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPendingRequest = true;
        this.wcaService.finishProject(
          this.project.identifier
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if (r.error) {
            const message = r.error;
            this.messageService.add({severity: 'error', summary: 'Error: Finish project', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success: Finish project', detail: 'The project has been finished'});
          }
        });
      }
    });
  }

  requestCancel(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to cancel this project',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPendingRequest = true;
        this.wcaService.cancelProject(
          this.project.identifier
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if (r.error) {
            const message = r.error;
            this.messageService.add({severity: 'error', summary: 'Error: Cancel project', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success: Cancel project', detail: 'The project has been canceled'});
          }
        });
      }
    });
  }

  update(): void {
    this.confirmationService.confirm({
      message: 'Please confirm that you want to finish the next milestone',
      header: 'Confirmation',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.displayPendingRequest = true;
        this.wcaService.finishMilestone(
          this.project.identifier,
          this.selectedMilestone.index,
          this.proofLink
        ).subscribe((r) => {
          this.displayPendingRequest = false;
          if (r.error) {
            const message = r.error;
            this.messageService.add({severity: 'error', summary: 'Error: Update milestone', detail: message});
          } else {
            this.messageService.add({severity: 'success', summary: 'Success: Update milestone', detail: 'The milestone has been upated'});
            this.displayUpdate = false;
          }
        });
      }
    });
  }

}
