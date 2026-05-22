import { Injectable, signal, computed } from '@angular/core';

export type Theme = 'light' | 'dark' | 'system';
export type PaletteName =
  | 'red'
  | 'green'
  | 'blue'
  | 'yellow'
  | 'cyan'
  | 'magenta'
  | 'orange'
  | 'chartreuse'
  | 'spring-green'
  | 'azure'
  | 'violet'
  | 'rose';

export const PALETTES: PaletteName[] = [
  'violet',
  'rose',
  'red',
  'orange',
  'yellow',
  'chartreuse',
  'green',
  'spring-green',
  'cyan',
  'azure',
  'blue',
  'magenta',
];

@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly _theme = signal<Theme>((this.readStored('theme') as Theme) ?? 'dark');
  private readonly _palette = signal<PaletteName>(
    (this.readStored('palette') as PaletteName) ?? 'violet',
  );

  readonly isDark = computed(() => {
    const t = this._theme();
    if (t === 'system') return window.matchMedia('(prefers-color-scheme: dark)').matches;
    return t === 'dark';
  });

  readonly palette = this._palette.asReadonly();

  constructor() {
    this.applyTheme(this.isDark());
    this.applyPalette(this._palette());
  }

  toggle(): void {
    this.setTheme(this.isDark() ? 'light' : 'dark');
  }

  setTheme(theme: Theme): void {
    this._theme.set(theme);
    localStorage.setItem('theme', theme);
    this.applyTheme(this.isDark());
  }

  setPalette(name: PaletteName): void {
    this._palette.set(name);
    localStorage.setItem('palette', name);
    this.applyPalette(name);
  }

  private applyTheme(dark: boolean): void {
    document.documentElement.classList.toggle('dark', dark);
  }

  private applyPalette(name: PaletteName): void {
    const cl = document.documentElement.classList;
    PALETTES.forEach((p) => cl.remove(`palette-${p}`));
    cl.add(`palette-${name}`);
  }

  private readStored(key: string): string | null {
    return localStorage.getItem(key);
  }
}
