import fs from 'fs';
import path from 'path';

function checkDir(dir: string) {
  for (const f of fs.readdirSync(dir)) {
    const full = path.join(dir, f);
    if (fs.statSync(full).isDirectory()) {
      checkDir(full);
    } else if (f.endsWith('.tsx') || f.endsWith('.ts')) {
      const content = fs.readFileSync(full, 'utf8');
      const hooks = ['useState', 'useEffect', 'useMemo', 'useCallback', 'useRef'];
      for (const hook of hooks) {
        const regex = new RegExp(`\\b${hook}\\s*[(<]`);
        if (regex.test(content)) {
          // Check if hook is imported
          const importRegex = new RegExp(`import\\s+.*\\b${hook}\\b.*from`);
          if (!importRegex.test(content)) {
            console.error(`🚨 MISSING IMPORT: ${hook} in ${full}`);
          }
        }
      }
    }
  }
}

console.log('Auditing React hook imports across src/client...');
checkDir('src/client');
console.log('Audit complete.');
