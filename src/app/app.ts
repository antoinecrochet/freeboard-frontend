import { Component } from '@angular/core';
import { Layout } from './layout/layout';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [Layout],
  template: `<app-layout></app-layout>`
})
export class App {}
