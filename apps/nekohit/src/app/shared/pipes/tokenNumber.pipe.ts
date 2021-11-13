import { DecimalPipe } from '@angular/common';
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'tokenNumber',
})
export class TokenNumber implements PipeTransform {
  constructor(private decimalPipe: DecimalPipe) {}
  transform(value: number, symbol: string) {
    if (symbol === 'CAT') {
      value = value / 100;
      return this.decimalPipe.transform(value, '1.2-2');
    } else if (symbol === 'GAS') {
      value = value / 100000000;
      return this.decimalPipe.transform(value, '1.8-8');
    }
    throw Error('unknown symbol provided');
  }
}
