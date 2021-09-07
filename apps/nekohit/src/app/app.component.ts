import { Component, OnInit } from '@angular/core';
import { PrimeIcons } from 'primeng/api';

@Component({
  selector: 'ritmin-frontend-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {

  events: any[] = [];

  title = 'nekohit';
  showPromotion = true;

  openTwitter(): void {
    window.open('https://twitter.com/nekohitproject', '_blank');
  }

  openDiscord(): void {
    window.open('https://discord.gg/YTePGhQne2', '_blank');
  }

  ngOnInit() {
    this.events = [
      {status: 'Connect Wallet', description: 'Connect with your wallet of choice. At the current stage, NekoHit supports NeoLine and WalletConnect. Once you are successfully connected, you can move on to creating a new project.', icon: PrimeIcons.LINK},
      {status: 'Create a new Project', description: 'Click on "Create Project" in the menubar and fill out the required information. Please keep in mind that once your project is on the blockchain, any alteration will cause a small GAS fee. Therefore double-check every detail before submitting it. ', icon: PrimeIcons.PLUS},
      {status: 'Setup Milestones', description: 'Defining the milestones is the most critical part of the creation of a new project. They show your audience how fast you will approach your work and when you plan to finish it. The milestones are the pillar of each project, and missing their deadline can result in a loss of staked tokens. It is crucial to understand how milestones work before you start your project. You will also have to mark one of the milestones as a threshold milestone. The chosen milestone will be an indication for your sponsors until when they can get a complete refund. Once the threshold is reached, your sponsors will only be able to refund parts of their initial investment. ',  icon: PrimeIcons.TAGS},
      {status: 'Stake Tokens', description: 'Your project is now publicly available for everyone to see as it is now on the blockchain. Finally, it is time to stake your project with CAT tokens. The staking is a security mechanism for your sponsors. If you fail to complete your work in time, the sponsors receive parts of it. The higher their initial contribution, the higher the reimbursement. After staking, your project is open for investing. Share the good news with your audience and get started! Tip: A high stake will attract more sponsors because it shows your confidence in completing the work on time.',  icon: PrimeIcons.MONEY_BILL},
      {status: 'Complete Milestones', description: 'After a while, the deadline for the first milestone will come closer. Make sure you have finished all the work you promised for this milestone. The last thing you want is unhappy sponsors wanting a refund. A requirement to mark a milestone as completed is providing proof of work. Optimally it is a link on which your sponsors can click. This link could, for example, lead them to a website where you show details of what you achieved. If you complete a milestone as finished, you won\'t lose any staked tokens, and you can proceed to work on the next one. If you miss the deadline of a milestone, it is not possible anymore to complete it. You will lose parts of your stakings to your sponsors.',  icon: PrimeIcons.COG},
      {status: 'Finish Project', description: 'You reached the last stage of your project. After the final milestone, the project will end. That means that the invested tokens from your sponsors will be unlocked and transferred to your wallet, and in case you missed at least one milestone, the sponsors will also receive their share.', icon: PrimeIcons.CHECK}
    ];
  }
}
