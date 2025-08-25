#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Final TypeScript Error Resolution Script
 * Handles the remaining specific patterns identified in the build output
 */

class FinalTypeScriptErrorFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.error-fix-backups', `final-fix-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    this.fixed = 0;
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async run() {
    console.log('🎯 Starting Final TypeScript Error Resolution...');
    
    const initialErrors = await this.getErrorCount();
    console.log(`📊 Initial error count: ${initialErrors}`);
    
    // Fix specific patterns
    await this.fixDestructuringPatterns();
    await this.fixComponentTypeAnnotations();
    await this.fixObjectPropertyPatterns();
    await this.fixParameterTypePatterns();
    
    const finalErrors = await this.getErrorCount();
    console.log(`📊 Final error count: ${finalErrors}`);
    console.log(`✅ Fixed ${initialErrors - finalErrors} errors`);
    
    // Try to build the system
    if (finalErrors < 50) {
      console.log('\n🏗️ Attempting to build the TypeScript Error Resolution System...');
      try {
        execSync('npm run build', { encoding: 'utf8', stdio: 'pipe' });
        console.log('✅ Build successful! TypeScript Error Resolution System is ready!');
        return true;
      } catch (error) {
        console.log('⚠️ Build still has issues, but major progress made');
        return false;
      }
    }
    
    return false;
  }

  async fixDestructuringPatterns() {
    console.log('🔧 Fixing destructuring patterns...');
    
    const patterns = [
      /const\s+\[\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\]/g,
      /useState<([^>]*)>\s*\(\s*([^)]*)\s*\)/g
    ];
    
    await this.processFilesWithPatterns([
      'src/features/**/*.ts',
      'src/features/**/*.tsx',
      'src/hooks/**/*.ts',
      'src/hooks/**/*.tsx'
    ], (content) => {
      // Fix: const [data: any, setData] = useState<any>(null);
      content = content.replace(/const\s+\[\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*\]/g, 'const [$1, $2]');
      return content;
    });
  }

  async fixComponentTypeAnnotations() {
    console.log('🔧 Fixing component type annotations...');
    
    await this.processFilesWithPatterns([
      'src/features/**/*.tsx',
      'src/pages/**/*.tsx'
    ], (content) => {
      // Fix: const Component: React.= () => {
      content = content.replace(/:\s*React\.\s*=/g, ': React.FC =');
      return content;
    });
  }

  async fixObjectPropertyPatterns() {
    console.log('🔧 Fixing object property patterns...');
    
    await this.processFilesWithPatterns([
      'src/services/**/*.ts',
      'src/utils/**/*.ts'
    ], (content) => {
      // Fix: property: any: value,
      content = content.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*([^,}]+)/g, '$1: $2');
      
      // Fix: method(param: any)
      content = content.replace(/console\.warn\(\s*([^,)]*)\s*,\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, 'console.warn($1, $2)');
      
      return content;
    });
  }

  async fixParameterTypePatterns() {
    console.log('🔧 Fixing parameter type patterns...');
    
    await this.processFilesWithPatterns([
      'src/utils/**/*.ts'
    ], (content) => {
      // Fix: (date: any: Date | string | number)
      content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*([^)]+)\s*\)/g, '($1: $2)');
      
      // Fix function parameters with complex types
      content = content.replace(/=\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*([^)]+)\s*\)\s*:/g, '= ($1: $2):');
      
      return content;
    });
  }

  async processFilesWithPatterns(globPatterns, transformFunction) {
    const files = await this.findMatchingFiles(globPatterns);
    
    for (const file of files) {
      try {
        if (!fs.existsSync(file)) continue;
        
        // Create backup
        const backupPath = path.join(this.backupDir, path.basename(file) + '.bak');
        fs.copyFileSync(file, backupPath);
        
        let content = fs.readFileSync(file, 'utf8');
        const originalContent = content;
        
        content = transformFunction(content);
        
        if (content !== originalContent) {
          fs.writeFileSync(file, content, 'utf8');
          this.fixed++;
          console.log(`   ✅ Fixed ${file}`);
        }
        
      } catch (error) {
        console.warn(`   ⚠️ Error processing ${file}:`, error.message);
      }
    }
  }

  async findMatchingFiles(globPatterns) {
    const files = new Set();
    
    for (const pattern of globPatterns) {
      const basePath = pattern.split('*')[0];
      if (fs.existsSync(basePath)) {
        const found = this.scanDirectoryRecursive(basePath);
        found.forEach(f => files.add(f));
      }
    }
    
    return Array.from(files);
  }

  scanDirectoryRecursive(dir) {
    const files = [];
    
    try {
      const entries = fs.readdirSync(dir, { withFileTypes: true });
      
      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        
        if (entry.isDirectory()) {
          files.push(...this.scanDirectoryRecursive(fullPath));
        } else if (entry.name.endsWith('.ts') || entry.name.endsWith('.tsx')) {
          files.push(fullPath);
        }
      }
    } catch (error) {
      // Directory doesn't exist or can't be read
    }
    
    return files;
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
  const fixer = new FinalTypeScriptErrorFixer();
  fixer.run().then(success => {
    if (success) {
      console.log('\n🎉 TypeScript Error Resolution System is now ready for deployment!');
      console.log('📋 You can now run: npm install -g . && error-resolver --help');
    } else {
      console.log('\n🔄 Continue with manual fixes or additional scripts for remaining errors');
    }
  }).catch(error => {
    console.error('❌ Final fixer failed:', error);
    process.exit(1);
  });
}

module.exports = { FinalTypeScriptErrorFixer };