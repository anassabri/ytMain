#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Comprehensive TypeScript Error Fixer
 * Handles complex patterns and remaining syntax issues
 */

class ComprehensiveTypeScriptErrorFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.error-fix-backups', `comprehensive-fix-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    this.fixed = 0;
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async run() {
    console.log('🎯 Starting Comprehensive TypeScript Error Fixer...');
    
    const initialErrors = await this.getErrorCount();
    console.log(`📊 Initial error count: ${initialErrors}`);
    
    // Get current errors to understand patterns
    const errors = await this.getCurrentErrors();
    const fileGroups = this.groupErrorsByFile(errors);
    
    console.log(`📁 Processing ${Object.keys(fileGroups).length} files with errors`);
    
    for (const [filePath, fileErrors] of Object.entries(fileGroups)) {
      await this.fixFileComprehensively(filePath, fileErrors);
    }
    
    const finalErrors = await this.getErrorCount();
    console.log(`📊 Final error count: ${finalErrors}`);
    console.log(`✅ Fixed ${initialErrors - finalErrors} errors`);
    
    return { initialErrors, finalErrors, fixed: initialErrors - finalErrors };
  }

  async getCurrentErrors() {
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return [];
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      return this.parseErrors(output);
    }
  }

  parseErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes(': error TS')) {
        const match = line.match(/^(.+)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)$/);
        if (match) {
          const [, file, lineNum, column, code, message] = match;
          errors.push({
            file: file.trim(),
            line: parseInt(lineNum),
            column: parseInt(column),
            code,
            message: message.trim(),
            rawError: line.trim()
          });
        }
      }
    }
    
    return errors;
  }

  groupErrorsByFile(errors) {
    const groups = {};
    for (const error of errors) {
      if (!groups[error.file]) {
        groups[error.file] = [];
      }
      groups[error.file].push(error);
    }
    return groups;
  }

  async fixFileComprehensively(filePath, fileErrors) {
    console.log(`🔧 Fixing ${filePath} (${fileErrors.length} errors)...`);
    
    try {
      if (!fs.existsSync(filePath)) {
        console.log(`   ⚠️ File not found: ${filePath}`);
        return;
      }

      // Create backup
      const backupPath = path.join(this.backupDir, path.basename(filePath));
      fs.copyFileSync(filePath, backupPath);
      
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Apply comprehensive fixes
      content = this.applyAllFixes(content, fileErrors);
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixed++;
        console.log(`   ✅ Applied fixes to ${filePath}`);
      } else {
        console.log(`   ➖ No changes needed in ${filePath}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error fixing ${filePath}:`, error.message);
    }
  }

  applyAllFixes(content, fileErrors) {
    // Fix 1: Complex union type annotations with any
    content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*(React\.[a-zA-Z_$][a-zA-Z0-9_$]*(?:<[^>]*>)?\s*\|\s*React\.[a-zA-Z_$][a-zA-Z0-9_$]*(?:<[^>]*>)?)\s*\)/g, '($1: $2)');
    
    // Fix 2: Filter expressions with any
    content = content.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*!==\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any/g, '$1 !== $2');
    
    // Fix 3: Function call arguments with any
    content = content.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '$1($2)');
    
    // Fix 4: Arrow function calls with any
    content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)\s*=>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '($1) => $2($3)');
    
    // Fix 5: Variable assignments with any
    content = content.replace(/=\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*;/g, '= $1;');
    
    // Fix 6: Return statements with any
    content = content.replace(/return\s+([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*;/g, 'return $1;');
    
    // Fix 7: Condition checks with any
    content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '($1)');
    
    // Fix 8: Object property access with any
    content = content.replace(/\.([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any/g, '.$1');
    
    // Fix 9: Array methods with any
    content = content.replace(/\.filter\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*=>\s*([^:]+)\s*:\s*any\s*\)/g, '.filter($1 => $2)');
    
    // Fix 10: Type assertions - remove unnecessary any
    content = content.replace(/\s+as\s+any\s*:\s*any/g, ' as any');
    
    // Fix 11: Parameter destructuring with any
    content = content.replace(/\{\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\}/g, '{ $1 }');
    
    // Fix 12: Generic type parameters with any
    content = content.replace(/<([^>]*)\s*:\s*any>/g, '<$1>');
    
    // Fix 13: useState hooks with any
    content = content.replace(/useState\s*<([^>]*)\s*:\s*any>/g, 'useState<$1>');
    
    // Fix 14: useEffect dependencies with any
    content = content.replace(/\[\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\]/g, '[$1]');
    
    // Fix 15: Callback functions with any
    content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '($1, $2)');
    
    // Fix 16: Simple parameter fixes that might have been missed
    content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*([a-zA-Z_$][a-zA-Z0-9_$]*(?:\.[a-zA-Z_$][a-zA-Z0-9_$]*)*(?:<[^>]*>)?)\s*\)/g, '($1: $2)');
    
    // Fix 17: Handle React event types specifically
    content = content.replace(/React\._MouseEvent/g, 'React.MouseEvent');
    content = content.replace(/React\._KeyboardEvent/g, 'React.KeyboardEvent');
    content = content.replace(/React\._ChangeEvent/g, 'React.ChangeEvent');
    content = content.replace(/React\._FormEvent/g, 'React.FormEvent');
    
    // Fix 18: Handle malformed generic types
    content = content.replace(/<([^>]*)\s*:\s*any([^>]*)>/g, '<$1$2>');
    
    // Fix 19: Fix console methods with any
    content = content.replace(/console\.([a-zA-Z]+)\(\s*([^,)]*)\s*:\s*any\s*\)/g, 'console.$1($2)');
    
    // Fix 20: Fix Date constructor with any
    content = content.replace(/new\s+Date\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, 'new Date($1)');
    
    return content;
  }

  async getErrorCount() {
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return 0;
    } catch (error) {
      const output = error.stdout || error.stderr || '';
      const matches = output.match(/error TS/g);
      return matches ? matches.length : 0;
    }
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new ComprehensiveTypeScriptErrorFixer();
  fixer.run().catch(error => {
    console.error('❌ Comprehensive fixer failed:', error);
    process.exit(1);
  });
}

module.exports = { ComprehensiveTypeScriptErrorFixer };