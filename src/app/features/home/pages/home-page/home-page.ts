import {
  afterNextRender,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  signal,
  viewChild,
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { LangService } from '../../../../core/lang/lang';
import { FormationPanelComponent } from '../../components/formation-panel/formation-panel';
import { FormationsTableComponent } from '../../components/formations-table/formations-table';
import { JournalTableComponent } from '../../components/journal-table/journal-table';
import { ProjectPanelComponent } from '../../components/project-panel/project-panel';
import { ProjectsGridComponent } from '../../components/projects-grid/projects-grid';
import { Formation } from '../../models/formation';
import { JournalEntry } from '../../models/journal-entry';
import { Project } from '../../models/project';
import formationsData from '../../data/formations.json';
import journalData from '../../data/journal.json';
import projectsData from '../../data/projects.json';

@Component({
  selector: 'app-home-page',
  imports: [
    FormationPanelComponent,
    FormationsTableComponent,
    JournalTableComponent,
    MatIconModule,
    ProjectPanelComponent,
    ProjectsGridComponent,
  ],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
})
export class HomePageComponent implements OnDestroy {
  // ── Private fields ────────────────────────────────────────────────────────
  private readonly copyToastEl = viewChild<ElementRef<HTMLSpanElement>>('copyToast');
  private readonly neuralCanvasEl = viewChild<ElementRef<HTMLCanvasElement>>('neuralCanvas');
  private copyTimeout: ReturnType<typeof setTimeout> | null = null;

  private raf = 0;
  private running = false;
  private ro?: ResizeObserver;
  private io?: IntersectionObserver;

  // ── Public injectables ─────────────────────────────────────────────────────────
  readonly lang = inject(LangService);

  // ── Education ─────────────────────────────────────────────────────────────
  readonly formations = formationsData as Formation[];
  readonly selectedFormation = signal<Formation | null>(null);

  // ── Projects ──────────────────────────────────────────────────────────────
  readonly projects = projectsData as Project[];
  readonly selectedProject = signal<Project | null>(null);

  // ── Journal ───────────────────────────────────────────────────────────────
  readonly journalEntries = journalData as JournalEntry[];
  readonly journalSort = signal<'date' | 'category'>('date');

  // ── Contact ───────────────────────────────────────────────────────────────
  emailCopied = false;

  constructor() {
    afterNextRender(() => this.initNeuralNetwork());
  }

  // ── Methods ────────────────────────────────────────────────────────────────

  onSelect(formation: Formation): void {
    this.selectedFormation.set(formation);
  }

  onPanelClose(): void {
    this.selectedFormation.set(null);
  }

  onProjectSelect(project: Project): void {
    this.selectedProject.set(project);
  }

  onProjectPanelClose(): void {
    this.selectedProject.set(null);
  }

  copyEmail(): void {
    // Copy to clipboard — fire and forget, don't gate the UI on the promise
    navigator.clipboard.writeText('julien.desrosiers+portfolio@uqtr.ca').catch(() => null);

    // Update button label
    this.emailCopied = true;
    if (this.copyTimeout) clearTimeout(this.copyTimeout);
    this.copyTimeout = setTimeout(() => (this.emailCopied = false), 2000);

    // Restart toast animation imperatively — no Angular binding involved
    const el = this.copyToastEl()?.nativeElement;
    if (el) {
      el.classList.remove('copy-toast--visible');
      void el.offsetWidth; // force reflow so browser registers the class removal
      el.classList.add('copy-toast--visible');
    }
  }

  ngOnDestroy(): void {
    this.running = false;
    cancelAnimationFrame(this.raf);
    this.ro?.disconnect();
    this.io?.disconnect();
  }

  // ── Neural network ────────────────────────────────────────────────────────

  private initNeuralNetwork(): void {
    const canvas = this.neuralCanvasEl()?.nativeElement;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const prefersReduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

    let W = 0,
      H = 0,
      DPR = 1;
    let nodes: Node[] = [];
    let pulses: Pulse[] = [];
    let lastPulseT = 0;

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      r: number;
      accent: boolean;
    }
    interface Pulse {
      a: Node;
      b: Node;
      t: number;
      dur: number;
    }

    // Reads Material 3 CSS variables — works in both light and dark themes
    const palette = () => {
      const style = getComputedStyle(document.body);
      const ink = style.getPropertyValue('--mat-sys-on-surface').trim() || '#14171c';
      const accent = style.getPropertyValue('--mat-sys-primary').trim() || '#2a5d52';
      const isLight = !document.documentElement.classList.contains('dark');
      return {
        lineRgb: parseColor(ink),
        nodeRgb: parseColor(ink),
        accentRgb: parseColor(accent),
        lineAlpha: isLight ? 0.22 : 0.32,
        nodeAlpha: isLight ? 0.55 : 0.75,
      };
    };

    // Handles #hex and rgb(r,g,b) — Material 3 may emit either
    const parseColor = (str: string): [number, number, number] => {
      str = str.trim();
      if (str.startsWith('#')) {
        let h = str.replace('#', '');
        if (h.length === 3)
          h = h
            .split('')
            .map((c) => c + c)
            .join('');
        const n = parseInt(h, 16);
        return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
      }
      const m = str.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
      if (m) return [+m[1], +m[2], +m[3]];
      return [0, 0, 0];
    };

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      DPR = Math.min(window.devicePixelRatio || 1, 2);
      W = rect.width;
      H = rect.height;
      canvas.width = Math.max(1, Math.round(W * DPR));
      canvas.height = Math.max(1, Math.round(H * DPR));
      ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
      seed();
    };

    const seed = () => {
      const target = Math.round(Math.min(70, Math.max(28, (W * H) / 22000)));
      nodes = Array.from({ length: target }, () => ({
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * 0.12,
        vy: (Math.random() - 0.5) * 0.12,
        r: 1.4 + Math.random() * 1.1,
        accent: Math.random() < 0.08,
      }));
      pulses = [];
      lastPulseT = 0;
    };

    const step = (t: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(step);

      const pal = palette();
      ctx.clearRect(0, 0, W, H);

      // Drift nodes, wrap at edges
      for (const n of nodes) {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < -10) n.x = W + 10;
        if (n.x > W + 10) n.x = -10;
        if (n.y < -10) n.y = H + 10;
        if (n.y > H + 10) n.y = -10;
      }

      // Connections
      const maxD = Math.min(180, Math.max(120, W * 0.13));
      const maxD2 = maxD * maxD;
      ctx.lineWidth = 1;
      for (let i = 0; i < nodes.length; i++) {
        const a = nodes[i];
        for (let j = i + 1; j < nodes.length; j++) {
          const b = nodes[j];
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 > maxD2) continue;
          const k = 1 - Math.sqrt(d2) / maxD;
          const alpha = pal.lineAlpha * k * k;
          ctx.strokeStyle = `rgba(${pal.lineRgb[0]},${pal.lineRgb[1]},${pal.lineRgb[2]},${alpha})`;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }

      // Spawn pulses
      if (!prefersReduce && t - lastPulseT > 700 && pulses.length < 4) {
        const a = nodes[(Math.random() * nodes.length) | 0];
        const candidates: Node[] = [];
        for (const b of nodes) {
          if (b === a) continue;
          const dx = a.x - b.x,
            dy = a.y - b.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < maxD2 && d2 > 400) candidates.push(b);
        }
        if (candidates.length) {
          const b = candidates[(Math.random() * candidates.length) | 0];
          pulses.push({ a, b, t: 0, dur: 900 + Math.random() * 700 });
          lastPulseT = t;
        } else {
          lastPulseT = t - 300;
        }
      }

      // Draw pulses
      for (let i = pulses.length - 1; i >= 0; i--) {
        const p = pulses[i];
        p.t += 16;
        const u = p.t / p.dur;
        if (u >= 1) {
          pulses.splice(i, 1);
          continue;
        }
        const x = p.a.x + (p.b.x - p.a.x) * u;
        const y = p.a.y + (p.b.y - p.a.y) * u;
        const grd = ctx.createRadialGradient(x, y, 0, x, y, 14);
        grd.addColorStop(
          0,
          `rgba(${pal.accentRgb[0]},${pal.accentRgb[1]},${pal.accentRgb[2]},0.55)`,
        );
        grd.addColorStop(1, `rgba(${pal.accentRgb[0]},${pal.accentRgb[1]},${pal.accentRgb[2]},0)`);
        ctx.fillStyle = grd;
        ctx.beginPath();
        ctx.arc(x, y, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = `rgba(${pal.accentRgb[0]},${pal.accentRgb[1]},${pal.accentRgb[2]},0.95)`;
        ctx.beginPath();
        ctx.arc(x, y, 1.8, 0, Math.PI * 2);
        ctx.fill();
      }

      // Draw nodes
      for (const n of nodes) {
        if (n.accent) {
          const grd = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, 9);
          grd.addColorStop(
            0,
            `rgba(${pal.accentRgb[0]},${pal.accentRgb[1]},${pal.accentRgb[2]},0.35)`,
          );
          grd.addColorStop(
            1,
            `rgba(${pal.accentRgb[0]},${pal.accentRgb[1]},${pal.accentRgb[2]},0)`,
          );
          ctx.fillStyle = grd;
          ctx.beginPath();
          ctx.arc(n.x, n.y, 9, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle = `rgba(${pal.accentRgb[0]},${pal.accentRgb[1]},${pal.accentRgb[2]},0.95)`;
        } else {
          ctx.fillStyle = `rgba(${pal.nodeRgb[0]},${pal.nodeRgb[1]},${pal.nodeRgb[2]},${pal.nodeAlpha})`;
        }
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    // Re-seed when the canvas is resized
    this.ro = new ResizeObserver(() => resize());
    this.ro.observe(canvas);

    // Pause when scrolled off-screen
    this.io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting && !this.running) {
            this.running = true;
            this.raf = requestAnimationFrame(step);
          } else if (!e.isIntersecting && this.running) {
            this.running = false;
            cancelAnimationFrame(this.raf);
          }
        }
      },
      { threshold: 0 },
    );
    this.io.observe(canvas);

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        this.running = false;
        cancelAnimationFrame(this.raf);
      } else if (!this.running) {
        this.running = true;
        this.raf = requestAnimationFrame(step);
      }
    });

    resize();
    this.running = true;
    this.raf = requestAnimationFrame(step);
  }
}
