import { inject, Injectable } from '@angular/core';
import { httpResource } from '@angular/common/http';
import { ApiService } from '../../../core/http/api';
import { ExampleItem } from '../models/example-item';

@Injectable({ providedIn: 'root' })
export class ExampleService {
  private readonly api = inject(ApiService);

  readonly items = httpResource<ExampleItem[]>(() => this.api.url('/posts'));

  itemById(id: () => number) {
    return httpResource<ExampleItem>(() => this.api.url(`/posts/${id()}`));
  }
}
