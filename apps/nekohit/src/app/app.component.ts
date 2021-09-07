import { Component } from '@angular/core';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {

  title = 'nekohit';
  showPromotion = true;

  openTwitter(): void {
    window.open('https://twitter.com/nekohitproject', '_blank');
  }

  openDiscord(): void {
    window.open('https://discord.gg/YTePGhQne2', '_blank');
  }
}
