import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';
import { throwError } from 'rxjs';

@Injectable()
export class ErrorService {
  constructor(private messageService: MessageService) {}

  public handleError(error: Error | string) {
    let message;
    if (error instanceof Error) {
      message = error.message;
    } else {
      message = error;
    }
    this.messageService.add({
      severity: 'warn',
      summary: 'Oops, there has been an error',
      detail: message,
      life: 10000,
    });
    return throwError(error);
  }
}
