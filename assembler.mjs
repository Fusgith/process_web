// Assemble le manuel en un seul fichier : chaque image de `source.html` est intégrée au HTML.
// Usage : node docs/manuel/assembler.mjs  →  docs/manuel/Manuel-Process.html
import { readFileSync, writeFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const dossier = dirname(fileURLToPath(import.meta.url));
const source = readFileSync(resolve(dossier, 'source.html'), 'utf8');
const manquantes = [];

const assemble = source.replace(/src="([^"]+\.png)"/g, (_, chemin) => {
  try {
    const image = readFileSync(resolve(dossier, chemin)).toString('base64');
    return `src="data:image/png;base64,${image}"`;
  } catch {
    manquantes.push(chemin);
    return `src="${chemin}"`;
  }
});

if (manquantes.length > 0) {
  console.error(`Images introuvables : ${manquantes.join(', ')}`);
  process.exit(1);
}
writeFileSync(resolve(dossier, 'Manuel-Process.html'), assemble);
console.log('Manuel assemblé : docs/manuel/Manuel-Process.html');
