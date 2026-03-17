import fs from 'fs';
import path from 'path';

const extDir = '.output/server/node_modules';
const srcDir = 'node_modules';
if (!fs.existsSync(extDir)) process.exit(0);

function getDeps(pkgDir) {
  try {
    const m = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
    return Object.keys({ ...(m.dependencies || {}), ...(m.peerDependencies || {}) });
  } catch { return []; }
}

function fill(pkgName) {
  const dest = path.join(extDir, pkgName);
  const src  = path.join(srcDir, pkgName);
  if (fs.existsSync(dest) || !fs.existsSync(src)) return;
  fs.cpSync(src, dest, { recursive: true });
  console.log('filled:', pkgName);
  for (const dep of getDeps(dest)) fill(dep);
}

// Scan existing externals and fill their missing transitive deps
function scanAndFill(dir) {
  if (!fs.existsSync(dir)) return;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    if (!entry.isDirectory()) continue;
    const pkgPath = path.join(dir, entry.name);
    if (entry.name.startsWith('@')) {
      for (const sub of fs.readdirSync(pkgPath)) {
        const fullName = `${entry.name}/${sub}`;
        for (const dep of getDeps(path.join(pkgPath, sub))) fill(dep);
      }
    } else {
      for (const dep of getDeps(pkgPath)) fill(dep);
    }
  }
}

scanAndFill(extDir);
console.log('Done filling transitive deps.');
