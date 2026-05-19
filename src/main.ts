import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

// Disable native browser scroll restoration — app.ts manages scroll position manually
history.scrollRestoration = 'manual';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
