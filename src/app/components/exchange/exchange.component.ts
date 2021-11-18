import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {NeolineService} from '../../services/neoline.service';
import {TypedValue} from '../../models/neoline';
import {getCatContractAddress, getUsdtContractAddress} from '../../utils';
import {from} from 'rxjs';
import {MessageService} from 'primeng/api';

@Component({
  selector: 'app-exchange',
  templateUrl: './exchange.component.html',
  styleUrls: ['./exchange.component.scss']
})
export class ExchangeComponent implements OnInit {

  mintForm: FormGroup;
  destroyForm: FormGroup;

  constructor(
    private formBuilder: FormBuilder,
    private neolineService: NeolineService,
    private messageService: MessageService
  ) { }

  ngOnInit(): void {
    this.mintForm =  this.formBuilder.group({
      catAmount: [1, Validators.required],
    });
    this.destroyForm =  this.formBuilder.group({
      catAmount: [1, Validators.required],
    });
  }

  get mintCatAmount(): number {
    return this.mintForm.get('catAmount').value;
  }

  get destroyCatAmount(): number {
    return this.destroyForm.get('catAmount').value;
  }

  mint(): void {
    const fromParam: TypedValue = {type: 'Address', value: this.neolineService.getAddress$().getValue()};
    const toParam: TypedValue = {type: 'Hash160', value: getCatContractAddress()};
    const amountParam: TypedValue = {type: 'Integer', value: (this.mintCatAmount * 100 * 5000).toString()};
    const dataParam: TypedValue = {type: 'Boolean', value: false};
    const parameters = [fromParam, toParam, amountParam, dataParam];
    console.log('Mint cat', parameters);
    from(
      this.neolineService.invoke({
        scriptHash: getUsdtContractAddress(),
        operation: 'transfer',
        args: parameters
      }).then(r => ({
        txId: r.txid,
        error: null
      }))
        .catch((error) => ({
          txId: null,
          error: this.neolineService.handleError(error)
        })))
      .subscribe((r) => {
        if (r.error) {
          const message = r.error;
          this.messageService.add({severity: 'error', summary: 'Error: Mint CAT', detail: message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Success: Mint CAT',
            detail: 'Please check your wallet for new minted CATs'});
        }
      });
  }

  destroy(): void {
    const fromParam: TypedValue = {type: 'Address', value: this.neolineService.getAddress$().getValue()};
    const amountParam: TypedValue = {type: 'Integer', value: (this.destroyCatAmount * 100).toString()};
    const parameters = [fromParam, amountParam];
    console.log('Destroy cat', parameters);
    from(
      this.neolineService.invoke({
        scriptHash: getCatContractAddress(),
        operation: 'destroyToken',
        args: parameters
      }).then(r => ({
        txId: r.txid,
        error: null
      }))
        .catch((error) => ({
          txId: null,
          error: this.neolineService.handleError(error)
        })))
      .subscribe((r) => {
        if (r.error) {
          const message = r.error;
          this.messageService.add({severity: 'error', summary: 'Error: Destroy CAT', detail: message});
        } else {
          this.messageService.add({severity: 'success', summary: 'Success: Destroy CAT',
            detail: 'Please check your wallet for your fUSDT'});
        }
      });
  }
}
