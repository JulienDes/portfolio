#!/usr/bin/env node
// Interactive theme initializer — run with `bun run init`
// Patches src/styles/_tokens.scss with your brand values.

import { createInterface } from 'readline';
import { readFileSync, writeFileSync } from 'fs';
import { resolve } from 'path';

const rl = createInterface({ input: process.stdin, output: process.stdout });
const ask = (q) => new Promise((res) => rl.question(q, res));

const TOKENS_PATH = resolve(import.meta.dirname, '../src/styles/_tokens.scss');

const M3_PALETTES = [
  'red', 'green', 'blue', 'yellow', 'cyan', 'magenta',
  'orange', 'chartreuse', 'spring-green', 'azure', 'violet', 'rose',
];

const DEFAULTS = {
  primary:      'violet',
  tertiary:     'rose',
  fontFamily:   'Inter',
  borderRadius: '12px',
};

async function pickPalette(prompt, defaultVal) {
  console.log(`  Options: ${M3_PALETTES.join(', ')}`);
  const answer = (await ask(`${prompt} [${defaultVal}]: `)).trim().toLowerCase();
  if (!answer) return defaultVal;
  if (!M3_PALETTES.includes(answer)) {
    console.log(`  ⚠️  Unknown palette "${answer}", using default "${defaultVal}".`);
    return defaultVal;
  }
  return answer;
}

async function main() {
  console.log('\n🎨  Theme initializer\n');
  console.log('Angular Material 3 derives secondary and neutral tones from the primary palette.');
  console.log('Pick a primary hue — all harmonious colors follow automatically.\n');

  const primary      = await pickPalette('Primary palette     ', DEFAULTS.primary);
  const tertiary     = await pickPalette('Tertiary palette    ', DEFAULTS.tertiary);
  const fontFamily   = (await ask(`Font family         [${DEFAULTS.fontFamily}]: `)).trim() || DEFAULTS.fontFamily;
  const borderRadius = (await ask(`Base border radius  [${DEFAULTS.borderRadius}]: `)).trim() || DEFAULTS.borderRadius;

  rl.close();

  let tokens = readFileSync(TOKENS_PATH, 'utf8');

  tokens = tokens
    .replace(/\$primary-palette:\s*mat\.\$[\w-]+-palette;/, `$primary-palette:  mat.$${primary}-palette;`)
    .replace(/\$tertiary-palette:\s*mat\.\$[\w-]+-palette;/, `$tertiary-palette: mat.$${tertiary}-palette;`)
    .replace(/\$font-family:\s*[^;]+;/, `$font-family:    '${fontFamily}', sans-serif;`)
    .replace(/\$border-radius-md:\s*[^;]+;/, `$border-radius-md: ${borderRadius};`);

  writeFileSync(TOKENS_PATH, tokens);
  console.log('\n _tokens.scss updated. Run `bun start` to see your theme.\n');
}

main().catch((e) => { console.error(e); process.exit(1); });
