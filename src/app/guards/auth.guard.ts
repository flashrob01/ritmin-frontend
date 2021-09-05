import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {NeolineService} from '../services/neoline.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public wallet: NeolineService, public router: Router) {
  }

  canActivate(): boolean {
    if (!this.wallet.getAddress$().getValue()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }
}
