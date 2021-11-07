import { Component } from '@angular/core';
import { RxState } from '@rx-angular/state';

interface Faq {
  question: string;
  answer: string;
}

interface FaqState {
  faqs: Faq[];
}

const initState: FaqState = {
  faqs: [
    {
      question: 'Where can I buy the CAT token?',
      answer:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      question: 'Where can I buy the CAT token?',
      answer:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    },
    {
      question: 'Where can I buy the CAT token?',
      answer:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
    },
    {
      question: 'Where can I buy the CAT token?',
      answer:
        'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum.',
    },
  ],
};

@Component({
  selector: 'ritmin-faq-table',
  templateUrl: './faq-table.component.html',
  styleUrls: ['./faq-table.component.scss'],
})
export class FaqTableComponent {
  state$ = this.state.select();
  constructor(private state: RxState<FaqState>) {
    this.state.set(initState);
  }
}
