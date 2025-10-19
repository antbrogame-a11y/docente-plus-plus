#!/usr/bin/env node
/**
 * replace-tokens.js
 * 
 * Finds and optionally replaces hardcoded color values and spacing with MD3 theme variables.
 * Can run in dry-run mode to preview changes before applying them.
 * 
 * Usage:
 *   node tools/replace-tokens.js --dir=./css --dry-run
 *   node tools/replace-tokens.js --dir=./css --apply
 *   node tools/replace-tokens.js --file=css/schedule.css --apply
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Parse command line arguments
const args = process.argv.slice(2);
let targetDir = null;
let targetFile = null;
let dryRun = true;

args.forEach(arg => {
  if (arg.startsWith('--dir=')) {
    targetDir = arg.replace('--dir=', '');
  } else if (arg.startsWith('--file=')) {
    targetFile = arg.replace('--file=', '');
  } else if (arg === '--apply') {
    dryRun = false;
  } else if (arg === '--dry-run') {
    dryRun = true;
  }
});

// Color mapping to MD3 variables
const COLOR_REPLACEMENTS = {
  // Primary colors (purple/blue variants)
  '#8657FF': 'var(--md-sys-color-primary)',
  '#6750A4': 'var(--md-sys-color-primary)',
  '#4a90e2': 'var(--md-sys-color-primary)',
  '#1976D2': 'var(--md-sys-color-primary)',
  
  // Light surfaces
  '#FFFFFF': 'var(--md-sys-color-surface)',
  '#FFFBFF': 'var(--md-sys-color-background)',
  '#F9F9F9': 'var(--md-sys-color-surface-variant)',
  '#f5f5f5': 'var(--md-sys-color-surface-container)',
  '#f0f0f0': 'var(--md-sys-color-surface-container-high)',
  
  // Text colors
  '#000000': 'var(--md-sys-color-on-surface)',
  '#1B1224': 'var(--md-sys-color-on-background)',
  
  // Error colors
  '#e74c3c': 'var(--md-sys-color-error)',
  '#D84B4B': 'var(--md-sys-color-error)',
};

// Spacing mapping to MD3 variables
const SPACING_REPLACEMENTS = {
  '4px': 'var(--md-spacing-xs)',
  '8px': 'var(--md-spacing-sm)',
  '16px': 'var(--md-spacing-md)',
  '24px': 'var(--md-spacing-lg)',
};

/**
 * Find files recursively in a directory
 */
function findFiles(dir, extensions = ['.css', '.html']) {
  const files = [];
  
  function walkDir(currentPath) {
    const items = readdirSync(currentPath);
    
    items.forEach(item => {
      const fullPath = join(currentPath, item);
      const stat = statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Skip node_modules and .git
        if (item !== 'node_modules' && item !== '.git' && item !== 'dist') {
          walkDir(fullPath);
        }
      } else if (stat.isFile()) {
        const ext = extname(fullPath);
        if (extensions.includes(ext)) {
          files.push(fullPath);
        }
      }
    });
  }
  
  walkDir(dir);
  return files;
}

/**
 * Analyze a file for potential replacements
 */
function analyzeFile(filePath) {
  const content = readFileSync(filePath, 'utf-8');
  const findings = [];
  
  // Check for hardcoded colors
  Object.entries(COLOR_REPLACEMENTS).forEach(([color, variable]) => {
    const regex = new RegExp(color.replace('#', '#'), 'gi');
    const matches = content.match(regex);
    
    if (matches) {
      findings.push({
        type: 'color',
        original: color,
        replacement: variable,
        count: matches.length
      });
    }
  });
  
  // Check for hardcoded spacing
  Object.entries(SPACING_REPLACEMENTS).forEach(([spacing, variable]) => {
    const regex = new RegExp(`\\b${spacing}\\b`, 'g');
    const matches = content.match(regex);
    
    if (matches) {
      findings.push({
        type: 'spacing',
        original: spacing,
        replacement: variable,
        count: matches.length
      });
    }
  });
  
  return findings;
}

/**
 * Apply replacements to a file
 */
function escapeRegExp(string) {
  // Escapes special characters for use in a regular expression
  return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function applyReplacements(filePath, findings) {
  let content = readFileSync(filePath, 'utf-8');
  let modified = false;
  
  findings.forEach(finding => {
    const regex = new RegExp(escapeRegExp(finding.original), 'gi');
    const newContent = content.replace(regex, finding.replacement);
    
    if (newContent !== content) {
      content = newContent;
      modified = true;
    }
  });
  
  if (modified) {
    writeFileSync(filePath, content, 'utf-8');
  }
  
  return modified;
}

// Main execution
console.log('🔍 MD3 Token Replacement Tool\n');
console.log(`Mode: ${dryRun ? 'DRY RUN (no changes will be made)' : 'APPLY (files will be modified)'}\n`);

let filesToProcess = [];

if (targetFile) {
  filesToProcess = [targetFile];
} else if (targetDir) {
  filesToProcess = findFiles(targetDir);
} else {
  console.error('❌ Error: Please specify --dir or --file');
  process.exit(1);
}

console.log(`Found ${filesToProcess.length} files to process\n`);

let totalFindings = 0;
let filesWithFindings = 0;
let filesModified = 0;

filesToProcess.forEach(file => {
  const findings = analyzeFile(file);
  
  if (findings.length > 0) {
    filesWithFindings++;
    totalFindings += findings.reduce((sum, f) => sum + f.count, 0);
    
    console.log(`\n📄 ${file}`);
    findings.forEach(finding => {
      console.log(`   ${finding.type.toUpperCase()}: ${finding.original} → ${finding.replacement} (${finding.count} occurrences)`);
    });
    
    if (!dryRun) {
      const modified = applyReplacements(file, findings);
      if (modified) {
        filesModified++;
        console.log('   ✅ Applied');
      }
    }
  }
});

console.log('\n' + '='.repeat(60));
console.log(`Summary:`);
console.log(`  Files analyzed: ${filesToProcess.length}`);
console.log(`  Files with findings: ${filesWithFindings}`);
console.log(`  Total replacements found: ${totalFindings}`);

if (!dryRun) {
  console.log(`  Files modified: ${filesModified}`);
  console.log('\n✅ Replacements applied successfully!');
} else {
  console.log('\n💡 This was a dry run. Use --apply to make changes.');
}
