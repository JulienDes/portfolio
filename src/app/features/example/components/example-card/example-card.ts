import { Component, input } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ExampleItem } from '../../models/example-item';

@Component({
  selector: 'app-example-card',
  imports: [MatCardModule],
  templateUrl: './example-card.html',
})
export class ExampleCardComponent {
  readonly item = input.required<ExampleItem>();
}
