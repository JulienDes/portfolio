import { Component, inject, input, output } from '@angular/core';

import { LangService } from '../../../../core/lang/lang';
import { Project } from '../../models/project';

@Component({
  selector: 'app-projects-grid',
  imports: [],
  templateUrl: './projects-grid.html',
  styleUrl: './projects-grid.scss',
})
export class ProjectsGridComponent {
  // ── Public injectables ────────────────────────────────────────────────────
  readonly lang = inject(LangService);

  // ── Public fields ─────────────────────────────────────────────────────────
  readonly projects = input<Project[]>([]);
  readonly selected = output<Project>();
}
