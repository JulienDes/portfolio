import { Component, inject } from '@angular/core';
import { ExampleCardComponent } from '../../components/example-card/example-card';
import { ExampleService } from '../../services/example';
import { SpinnerComponent } from '../../../../shared/components/spinner/spinner';
import { ErrorStateComponent } from '../../../../shared/components/error-state/error-state';
import { EmptyStateComponent } from '../../../../shared/components/empty-state/empty-state';

@Component({
  selector: 'app-example-page',
  imports: [ExampleCardComponent, SpinnerComponent, ErrorStateComponent, EmptyStateComponent],
  templateUrl: './example-page.html',
  styleUrl: './example-page.scss',
})
export class ExamplePageComponent {
  readonly items = inject(ExampleService).items;
}
