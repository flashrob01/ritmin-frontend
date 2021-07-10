import { Injectable } from "@angular/core";
import { CanActivate, Router } from "@angular/router";
import { WalletConnectService } from "../services/walletconnect.service";

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(public wallet: WalletConnectService, public router: Router) {}

  canActivate(): boolean {
    if (!this.wallet.address$.getValue()) {
      this.router.navigate(['']);
      return false;
    }
    return true;
  }}
