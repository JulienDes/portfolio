import { Component, effect, inject, input, viewChild } from '@angular/core';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

import { LangService } from '../../../../core/lang/lang';
import { JournalEntry } from '../../models/journal-entry';

@Component({
  selector: 'app-journal-table',
  imports: [MatTableModule, MatSortModule],
  templateUrl: './journal-table.html',
  styleUrl: './journal-table.scss',
})
export class JournalTableComponent {
  private readonly sort = viewChild<MatSort>(MatSort);
  private readonly COLORS = ['primary', 'secondary', 'tertiary', 'error'];

  readonly lang = inject(LangService);
  readonly entries = input<JournalEntry[]>([]);

  readonly displayedColumns = ['date', 'category', 'description'];
  readonly dataSource = new MatTableDataSource<JournalEntry>([]);

  constructor() {
    effect(() => {
      this.dataSource.data = this.entries();
    });

    effect(() => {
      const sort = this.sort();
      if (!sort) return;
      this.dataSource.sort = sort;
      this.dataSource.sortingDataAccessor = (item, property) => {
        if (property === 'category') return this.lang.t(item.category.en, item.category.fr);
        if (property === 'date') return item.date === 'TBD' ? '' : item.date;
        return (item as unknown as Record<string, string>)[property] ?? '';
      };
      sort.sort({ id: 'date', start: 'desc', disableClear: false });
    });
  }

  categoryColor(category: { en: string; fr: string }): string {
    let hash = 0;
    for (const c of category.en) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
    return this.COLORS[hash % this.COLORS.length];
  }
}
