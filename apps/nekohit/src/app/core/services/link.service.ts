import { Injectable } from '@angular/core';

@Injectable()
export class LinkService {
  public openTwitter(): void {
    window.open('https://twitter.com/nekohitproject', '_blank');
  }

  public openDiscord(): void {
    window.open('https://discord.gg/YTePGhQne2', '_blank');
  }

  public openWhitepaper(): void {
    window.open('https://github.com/NekoHitDev/whitepaper/tags', '_blank');
  }

  public openGithub(): void {
    window.open('https://github.com/NekoHitDev', '_blank');
  }

  public openBlog(): void {
    window.open('https://medium.com/nekohit', '_blank');
  }

  public openDevDocumentation(): void {
    window.open('https://github.com/NekoHitDev/Ritmin/wiki', '_blank');
  }

  public openTransaction(tx: string, baseUrl: string): void {
    window.open(baseUrl + tx);
  }
}
