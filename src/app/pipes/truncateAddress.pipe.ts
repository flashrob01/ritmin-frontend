import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
  name: 'truncateAddress'
})
export class TruncateAddressPipe implements PipeTransform {
  transform(value: string, ellipsis = '...'): string {
    const start = value.substring(0, 5);
    const end = value.substring(value.length - 5, value.length);
    return start + ellipsis + end;
  }
}
