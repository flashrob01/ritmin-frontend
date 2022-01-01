import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable()
export class NotificationService {
  constructor(private messageService: MessageService) {}

  public tx(txId: string): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Transaction successful',
      detail: txId,
      life: 5000,
      key: 'success',
    });
  }
}
