import { Component, inject, input, output } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { BreakpointObserver } from '@angular/cdk/layout';
import { map } from 'rxjs';

import { LangService } from '../../../../core/lang/lang';
import { Formation } from '../../models/formation';

@Component({
  selector: 'app-formations-table',
  imports: [MatTableModule, MatIconModule],
  templateUrl: './formations-table.html',
  styleUrl: './formations-table.scss',
})
export class FormationsTableComponent {
  // ── Public injectables ──
  readonly lang = inject(LangService);

  // ── Public fields ──
  readonly formations = input<Formation[]>([]);
  readonly selected = output<Formation>();
  readonly displayedColumns = ['type', 'title', 'institution', 'date'];

  readonly isMobile = toSignal(
    inject(BreakpointObserver)
      .observe('(max-width: 599px)')
      .pipe(map((r) => r.matches)),
    { initialValue: false },
  );
}
