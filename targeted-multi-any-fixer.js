#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

/**
 * Targeted Multiple Any Annotation Fixer
 * Specifically targets the "any: any: any" and "any: React.Type" patterns
 */

class MultipleAnyAnnotationFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.error-fix-backups', `multi-any-fix-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    this.fixed = 0;
    
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async run() {
    console.log('🎯 Starting Targeted Multiple Any Annotation Fixer...');
    
    // Get all files with the pattern
    const affectedFiles = await this.findAffectedFiles();
    console.log(`📁 Found ${affectedFiles.length} affected files`);
    
    for (const file of affectedFiles) {
      await this.fixFile(file);
    }
    
    console.log(`✅ Fixed ${this.fixed} issues across ${affectedFiles.length} files`);
    
    // Check the results
    const newErrors = await this.getErrorCount();
    console.log(`📊 Remaining errors: ${newErrors}`);
  }

  async findAffectedFiles() {
    const files = [];
    
    // Scan specific directories
    const dirsToScan = [
      'components',
      'contexts', 
      'src/features',
      'src/hooks',
      'src/pages',
      'src/services',
      'src/utils'
    ];
    
    for (const dir of dirsToScan) {
      if (fs.existsSync(dir)) {
        const found = this.scanDirectory(dir);
        files.push(...found);
      }
    }
    
    return files;
  }

  scanDirectory(dir) {
    const files = [];
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        files.push(...this.scanDirectory(fullPath));
      } else if (entry.name.endsWith('.tsx') || entry.name.endsWith('.ts')) {
        if (this.fileHasPattern(fullPath)) {
          files.push(fullPath);
        }
      }
    }
    
    return files;
  }

  fileHasPattern(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return content.includes(': any:') || content.includes(': any ');
    } catch {
      return false;
    }
  }

  async fixFile(filePath) {
    console.log(`🔧 Fixing ${filePath}...`);
    
    try {
      // Create backup
      const backupPath = path.join(this.backupDir, path.basename(filePath));
      fs.copyFileSync(filePath, backupPath);
      
      let content = fs.readFileSync(filePath, 'utf8');
      const originalContent = content;
      
      // Fix Pattern 1: (param: any: any: any...) -> (param: any)
      content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any(?:\s*:\s*any)+(?:\s*:\s*[^)]*)*\s*\)/g, '($1: any)');
      
      // Fix Pattern 2: (param: any: React.Type) -> (param: React.Type)  
      content = content.replace(/\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*(React\.[a-zA-Z_$][a-zA-Z0-9_$]*(?:<[^>]*>)?)\s*\)/g, '($1: $2)');
      
      // Fix Pattern 3: function parameter declarations
      content = content.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any(?:\s*:\s*any)+/g, '$1: any');
      
      // Fix Pattern 4: interface/type definitions
      content = content.replace(/:\s*\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any(?:\s*:\s*any)+\s*\)/g, ': ($1: any)');
      
      // Fix Pattern 5: Arrow function with any: any patterns
      content = content.replace(/=>\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '=> $1($2)');
      
      // Fix Pattern 6: Function call with any: any
      content = content.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\(\s*([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*\)/g, '$1($2)');
      
      if (content !== originalContent) {
        fs.writeFileSync(filePath, content, 'utf8');
        this.fixed++;
        console.log(`   ✅ Fixed patterns in ${filePath}`);
      } else {
        console.log(`   ➖ No changes needed in ${filePath}`);
      }
      
    } catch (error) {
      console.error(`   ❌ Error fixing ${filePath}:`, error.message);
    }
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
  const fixer = new MultipleAnyAnnotationFixer();
  fixer.run().catch(error => {
    console.error('❌ Fixer failed:', error);
    process.exit(1);
  });
}

module.exports = { MultipleAnyAnnotationFixer };