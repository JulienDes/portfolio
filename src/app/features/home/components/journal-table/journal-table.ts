import { Component, computed, effect, inject, input, signal, viewChild } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';

import { LangService } from '../../../../core/lang/lang';
import { JournalEntry } from '../../models/journal-entry';

@Component({
  selector: 'app-journal-table',
  imports: [MatTableModule, MatSortModule, MatIconModule],
  templateUrl: './journal-table.html',
  styleUrl: './journal-table.scss',
})
export class JournalTableComponent {
  // ── Private injectables (must precede public fields per member-ordering) ──
  private readonly sort = viewChild<MatSort>(MatSort);
  private readonly COLORS = ['primary', 'secondary', 'tertiary', 'error'];

  // ── Public injectables ──
  readonly lang = inject(LangService);
  readonly entries = input<JournalEntry[]>([]);

  readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 599px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );

  // ── Mobile sort ──
  readonly sortBy = signal<'date' | 'category'>('date');

  readonly sortedEntries = computed(() => {
    const entries = this.entries();
    const sort = this.sortBy();
    return [...entries].sort((a, b) => {
      if (sort === 'date') {
        if (a.date === 'TBD') return 1;
        if (b.date === 'TBD') return -1;
        return b.date.localeCompare(a.date);
      }
      return this.lang
        .t(a.category.en, a.category.fr)
        .localeCompare(this.lang.t(b.category.en, b.category.fr));
    });
  });

  // ── Public fields ──
  readonly displayedColumns = ['date', 'category', 'description'];
  readonly dataSource = new MatTableDataSource<JournalEntry>([]);

  // ── Constructor ──
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

  // ── Public methods ──
  categoryColor(category: { en: string; fr: string }): string {
    let hash = 0;
    for (const c of category.en) hash = (hash * 31 + c.charCodeAt(0)) & 0xffffff;
    return this.COLORS[hash % this.COLORS.length];
  }
}
