import {Component, OnInit} from '@angular/core';
import {WCA} from '../../models/wca';
import {WcaService} from '../../services/wca.service';
import {ActivatedRoute} from '@angular/router';
import {WalletConnectService} from '../../services/walletconnect.service';
import {wallet} from '@cityofzion/neon-js';
import { ConfirmationService, MessageService } from 'primeng/api';

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
  purchaseAmount: number;
  displayPendingRequest = false;

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
          .subscribe((amount) => this.purchasedAmount = amount);
      }
    }
  }

  formatDuration(ms: number): string {
    if (ms < 0) {
      ms = -ms;
    }
    const time = {
      day: Math.floor(ms / 86400000),
      hour: Math.floor(ms / 3600000) % 24,
      minute: Math.floor(ms / 60000) % 60,
      second: Math.floor(ms / 1000) % 60,
      millisecond: Math.floor(ms) % 1000
    };
    return Object.entries(time)
      .filter(val => val[1] !== 0)
      .map(([key, val]) => `${val} ${key}${val !== 1 ? 's' : ''}`)
      .join(', ');
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
        this.purchaseAmount,
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
    }
  }
}
