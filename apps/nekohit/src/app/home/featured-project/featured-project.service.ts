import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';

export interface FeaturedProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  image: string;
}

const projectList: FeaturedProject[] = [
  {
    id: 'randomId',
    image: 'assets/images/placeholder-project.png',
    title: 'Lorem Ispum',
    subtitle: 'Lorem Ipsum dolor sit amet',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  {
    id: 'randomId',
    image: 'assets/images/placeholder-project.png',
    title: 'Lorem Ispum',
    subtitle: 'Lorem Ipsum dolor sit amet',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  {
    id: 'randomId',
    image: 'assets/images/placeholder-project.png',
    title: 'Lorem Ispum',
    subtitle: 'Lorem Ipsum dolor sit amet',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
  {
    id: 'randomId',
    image: 'assets/images/placeholder-project.png',
    title: 'Lorem Ispum',
    subtitle: 'Lorem Ipsum dolor sit amet',
    description:
      'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.',
  },
];

Injectable();
export class FeaturedProjectService {
  getProjects(): Observable<FeaturedProject[]> {
    return of(projectList);
  }
}
