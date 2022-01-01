import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';
import { TokenService } from '../../core/services/token.service';

@Pipe({
  name: 'tokenNumber',
})
export class TokenNumber implements PipeTransform {
  constructor(
    private decimalPipe: DecimalPipe,
    private tokenService: TokenService
  ) {}
  transform(value: number | null, symbol: string | undefined) {
    if (symbol === undefined || value === null) {
      return;
    }
    const token = this.tokenService.getTokenBySymbol(symbol);
    value = value / Math.pow(10, token.decimals);
    return this.decimalPipe.transform(
      value,
      '1.' + token.decimals + '-' + token.decimals
    );
  }
}
