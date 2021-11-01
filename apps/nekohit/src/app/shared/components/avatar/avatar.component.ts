import { Component, Input } from '@angular/core';
import { RxState } from '@rx-angular/state';

interface AvatarState {
  svg: string;
  pxWidth: number;
}

@Component({
  selector: 'ritmin-avatar',
  templateUrl: './avatar.component.html',
  styleUrls: ['./avatar.component.scss'],
  providers: [RxState],
})
export class AvatarComponent {
  state$ = this.state.select();

  constructor(private state: RxState<AvatarState>) {}

  @Input() set svg(svg: string) {
    this.state.set({ svg });
  }

  @Input() set pxWidth(pxWidth: number) {
    this.state.set({ pxWidth });
  }
}
