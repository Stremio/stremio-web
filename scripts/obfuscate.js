const fs = require('fs');
const path = require('path');
const JavaScriptObfuscator = require('javascript-obfuscator');

const INPUT_DIR = path.join(__dirname, '..', 'dist');
const OUTPUT_DIR = path.join(__dirname, '..', 'dist-obf');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function obfuscateFileContents(sourcePath, destPath) {
  const code = fs.readFileSync(sourcePath, 'utf8');
  const obf = JavaScriptObfuscator.obfuscate(code, {
    compact: true,
    controlFlowFlattening: true,
    controlFlowFlatteningThreshold: 0.75,
    deadCodeInjection: true,
    deadCodeInjectionThreshold: 0.4,
    stringArray: true,
    stringArrayEncoding: ['base64'],
    rotateStringArray: true,
    stringArrayThreshold: 0.75,
  });
  fs.writeFileSync(destPath, obf.getObfuscatedCode(), 'utf8');
}

function copyAndObfuscate(srcDir, destDir) {
  ensureDir(destDir);
  for (const name of fs.readdirSync(srcDir)) {
    const srcPath = path.join(srcDir, name);
    const destPath = path.join(destDir, name);
    const stat = fs.statSync(srcPath);
    if (stat.isDirectory()) {
      copyAndObfuscate(srcPath, destPath);
    } else {
      if (name.endsWith('.js')) {
        obfuscateFileContents(srcPath, destPath);
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

try {
  if (!fs.existsSync(INPUT_DIR)) {
    console.error('Input dist folder not found. Run `npm run build` first.');
    process.exit(1);
  }
  if (fs.existsSync(OUTPUT_DIR)) {
    fs.rmSync(OUTPUT_DIR, { recursive: true, force: true });
  }
  copyAndObfuscate(INPUT_DIR, OUTPUT_DIR);
  console.log('Obfuscated build written to:', OUTPUT_DIR);
} catch (err) {
  console.error('Obfuscation failed', err);
  process.exit(1);
}
