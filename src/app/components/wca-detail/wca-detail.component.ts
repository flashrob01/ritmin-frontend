import {Component, OnInit} from '@angular/core';
import {WCA} from '../../models/wca';
import {WcaService} from '../../services/wca.service';
import {ActivatedRoute} from '@angular/router';
import {WalletConnectService} from '../../services/walletconnect.service';
import {wallet} from '@cityofzion/neon-js';
import {MessageService} from 'primeng/api';
import {finalize} from 'rxjs/operators';

@Component({
  selector: 'app-wca-detail',
  templateUrl: './wca-detail.component.html',
  styleUrls: ['./wca-detail.component.scss']
})
export class WcaDetailComponent implements OnInit {
  wca: WCA | null = null;
  purchasedAmount = 0;
  isOwner = false;
  now = new Date();
  displayPurchase = false;
  purchaseAmount: number;
  isLoading = false;

  constructor(
    private route: ActivatedRoute,
    private readonly wcaService: WcaService,
    public readonly walletService: WalletConnectService,
    private messageService: MessageService
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
          .subscribe((amount) => this.purchasedAmount = amount / 100);
      }
    }
  }

  payStake(): void {
    if (this.walletService.address$.getValue() != null) {
      this.messageService.add({
        severity: 'success',
        summary: 'Request sent',
        detail: 'Please approve the request in your wallet.'
      });
      this.wcaService.transferCatToken(
        this.walletService.address$.getValue(),
        this.wca.stakePer100Token * this.wca.maxTokenSoldCount * 100,
        this.wca.identifier
      ).subscribe((r) => {
        if (r['error']) {
          const message = r['error'].message;
          this.messageService.add({severity: 'error', summary: 'Error', detail: message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Success', detail: 'Your payment was successful'});
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

  purchase(): void {
    if (this.walletService.address$.getValue() != null) {
      this.isLoading = true;
      this.messageService.add({
        severity: 'success',
        summary: 'Request sent',
        detail: 'Please approve the request in your wallet.'
      });
      this.wcaService.transferCatToken(
        this.walletService.address$.getValue(),
        this.purchaseAmount * 100,
        this.wca.identifier
      ).pipe(finalize(() => this.isLoading = false)).subscribe((r) => {
        if (r['error']) {
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

  makeRefund(): void {
    if (this.walletService.address$.getValue() != null) {
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
    }
  }

  requestFinish(): void {
    this.isLoading = true;
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
    });
  }
}
