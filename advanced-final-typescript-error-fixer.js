#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Advanced Final TypeScript Error Resolution Script
 * Fixes remaining critical syntax errors after initial deployment
 */

class AdvancedFinalTypeScriptErrorFixer {
  constructor() {
    this.projectRoot = process.cwd();
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    this.backupDir = path.join(this.projectRoot, '.error-fix-backups', `advanced-final-fix-${this.timestamp}`);
    
    this.ensureDirectories();
  }

  ensureDirectories() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  async run() {
    console.log('🔧 Advanced Final TypeScript Error Resolution Script');
    console.log('Fixing remaining critical syntax errors...\n');
    
    // Get current errors
    const errors = await this.getFreshErrors();
    console.log(`Found ${errors.length} remaining errors to fix\n`);
    
    if (errors.length === 0) {
      console.log('✅ No errors found - system is ready!');
      return;
    }
    
    // Fix import syntax errors
    await this.fixImportSyntaxErrors(errors);
    
    // Fix parameter syntax errors
    await this.fixParameterSyntaxErrors(errors);
    
    // Fix JSX component errors
    await this.fixJSXComponentErrors(errors);
    
    // Final validation
    await this.validateFixes();
    
    console.log('\n🎉 Advanced final TypeScript error resolution completed!');
  }

  async getFreshErrors() {
    try {
      execSync('npx tsc --noEmit --skipLibCheck 2>&1', { encoding: 'utf8' });
      return [];
    } catch (error) {
      const output = error.stdout || '';
      return this.parseErrors(output);
    }
  }

  parseErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes(': error TS')) {
        const match = line.match(/^(.+)\((\d+),(\d+)\): error (TS\d+): (.+)$/);
        if (match) {
          const [, file, lineNum, col, code, message] = match;
          errors.push({
            file: file.trim(),
            line: parseInt(lineNum),
            column: parseInt(col),
            code,
            message: message.trim()
          });
        }
      }
    }
    
    return errors;
  }

  async fixImportSyntaxErrors(errors) {
    console.log('🔧 Fixing import syntax errors...');
    
    const importErrors = errors.filter(e => 
      (e.message.includes("',' expected") || e.message.includes("Identifier expected")) && 
      e.line <= 10 // Import statements are usually at the top
    );
    
    const fileGroups = new Map();
    importErrors.forEach(error => {
      if (!fileGroups.has(error.file)) {
        fileGroups.set(error.file, []);
      }
      fileGroups.get(error.file).push(error);
    });
    
    for (const [file, fileErrors] of fileGroups) {
      console.log(`   Fixing imports in ${file}...`);
      this.createBackup(file);
      
      try {
        const content = fs.readFileSync(file, 'utf8');
        let lines = content.split('\n');
        
        // Apply specific fixes based on known patterns
        for (let i = 0; i < Math.min(lines.length, 10); i++) {
          const line = lines[i];
          
          // Fix SearchResultsPage import issue
          if (file.includes('SearchResultsPage') && line.includes('{, MagnifyingGlassIcon}')) {
            lines[i] = line.replace('{, MagnifyingGlassIcon}', '{ MagnifyingGlassIcon }');
          }
          
          // Fix ShortsPage import issue
          if (file.includes('ShortsPage') && line.includes('{, ')) {
            lines[i] = line.replace('{, ', '{ ');
          }
          
          // Fix SubscriptionsPage import issues
          if (file.includes('SubscriptionsPage')) {
            if (line.includes('{, ')) {
              lines[i] = line.replace('{, ', '{ ');
            }
            if (line.includes('{ as ')) {
              lines[i] = line.replace('{ as ', '{ ChevronDownIcon as ');
            }
          }
          
          // Fix WatchLaterPage import issue
          if (file.includes('WatchLaterPage') && line.includes('{, ExclamationTriangleIcon}')) {
            lines[i] = line.replace('{, ExclamationTriangleIcon}', '{ ClockIcon, ExclamationTriangleIcon }');
          }
          
          // Generic fixes for malformed imports
          if (line.includes('{,') && line.includes('from \'@heroicons/react')) {
            lines[i] = line.replace('{,', '{');
          }
        }
        
        fs.writeFileSync(file, lines.join('\n'));
        console.log(`     ✅ Fixed import syntax in ${file}`);
        
      } catch (err) {
        console.error(`     ❌ Failed to fix ${file}:`, err.message);
      }
    }
  }

  async fixParameterSyntaxErrors(errors) {
    console.log('🔧 Fixing parameter syntax errors...');
    
    const paramErrors = errors.filter(e => 
      e.message.includes("',' expected") && (
        e.message.includes('any') || 
        e.file.includes('ShortsPage') ||
        e.file.includes('metadataNormalizationService')
      )
    );
    
    for (const error of paramErrors) {
      console.log(`   Fixing ${error.file}:${error.line}...`);
      this.createBackup(error.file);
      
      try {
        const content = fs.readFileSync(error.file, 'utf8');
        let lines = content.split('\n');
        
        if (lines[error.line - 1]) {
          const line = lines[error.line - 1];
          
          // Fix : any patterns in type annotations
          if (line.includes(': any')) {
            lines[error.line - 1] = line.replace(/:\s*any/g, ' as any');
          }
          
          // Fix specific patterns we identified
          if (line.includes('prev: any')) {
            lines[error.line - 1] = line.replace('prev: any', 'prev as any');
          }
          
          if (line.includes('count: any')) {
            lines[error.line - 1] = line.replace('count: any', 'count as any');
          }
          
          // Fix description: any: string pattern
          if (line.includes('description: any: string')) {
            lines[error.line - 1] = line.replace('description: any: string', 'description: string');
          }
          
          // Fix duration: any: string pattern
          if (line.includes('duration: any: string')) {
            lines[error.line - 1] = line.replace('duration: any: string', 'duration: string');
          }
          
          fs.writeFileSync(error.file, lines.join('\n'));
          console.log(`     ✅ Fixed parameter syntax in ${error.file}:${error.line}`);
        }
        
      } catch (err) {
        console.error(`     ❌ Failed to fix ${error.file}:${error.line}:`, err.message);
      }
    }
  }

  async fixJSXComponentErrors(errors) {
    console.log('🔧 Fixing JSX component errors...');
    
    const jsxErrors = errors.filter(e => 
      e.message.includes('Identifier expected') ||
      e.message.includes('Expression expected') ||
      e.message.includes("':' expected") ||
      e.message.includes('Unexpected token')
    );
    
    for (const error of jsxErrors) {
      console.log(`   Analyzing ${error.file}:${error.line}...`);
      this.createBackup(error.file);
      
      try {
        const content = fs.readFileSync(error.file, 'utf8');
        let lines = content.split('\n');
        
        if (lines[error.line - 1]) {
          const line = lines[error.line - 1];
          
          // Fix JSX component attribute patterns in WatchPage
          if (error.file.includes('WatchPage')) {
            if (line.includes('<videoId=')) {
              lines[error.line - 1] = line.replace('<videoId=', '<VideoPlayer videoId=');
            } else if (line.includes('<video=')) {
              lines[error.line - 1] = line.replace('<video=', '<VideoPlayer video=');
            } else if (line.includes('<liked=')) {
              lines[error.line - 1] = line.replace('<liked=', '<VideoInteractions liked=');
            } else if (line.includes('<comments=')) {
              lines[error.line - 1] = line.replace('<comments=', '<CommentSection comments=');
            } else if (line.includes('<currentVideo=')) {
              lines[error.line - 1] = line.replace('<currentVideo=', '<VideoRecommendations currentVideo=');
            } else if (line.includes('<isOpen=')) {
              lines[error.line - 1] = line.replace('<isOpen=', '<SaveToPlaylistModal isOpen=');
            }
          }
          
          // Fix UserPage expression issues
          if (error.file.includes('UserPage') && error.message.includes('Expression expected')) {
            if (line.includes('onTabChange={')) {
              lines[error.line - 1] = line.replace('onTabChange={', 'onTabChange={() => {');
            }
          }
          
          fs.writeFileSync(error.file, lines.join('\n'));
          console.log(`     ✅ Fixed JSX component in ${error.file}:${error.line}`);
        }
        
      } catch (err) {
        console.error(`     ❌ Failed to fix ${error.file}:${error.line}:`, err.message);
      }
    }
  }

  createBackup(file) {
    if (fs.existsSync(file)) {
      const backupFile = path.join(this.backupDir, file.replace(/[/\\]/g, '_'));
      fs.copyFileSync(file, backupFile);
    }
  }

  async validateFixes() {
    console.log('✅ Validating fixes...');
    
    try {
      execSync('npx tsc --noEmit --skipLibCheck 2>&1', { encoding: 'utf8' });
      console.log('   ✅ TypeScript compilation successful!');
      
      try {
        execSync('npm run build', { encoding: 'utf8', stdio: 'pipe' });
        console.log('   ✅ Project build successful!');
        console.log('   🎉 Real TypeScript Error Resolution System is now fully deployed!');
      } catch (buildError) {
        console.log('   ⚠️ Build has issues, but TypeScript compilation passed');
      }
      
    } catch (error) {
      const remaining = this.parseErrors(error.stdout || '');
      console.log(`   📊 ${remaining.length} errors remaining after fixes`);
      
      if (remaining.length < 20) {
        console.log('   Remaining errors:');
        remaining.slice(0, 10).forEach(err => {
          console.log(`     ${err.file}:${err.line} - ${err.code}: ${err.message}`);
        });
      }
    }
  }
}

// Run the fixer
if (require.main === module) {
  const fixer = new AdvancedFinalTypeScriptErrorFixer();
  fixer.run().catch(error => {
    console.error('❌ Advanced final fix script failed:', error);
    process.exit(1);
  });
}

module.exports = { AdvancedFinalTypeScriptErrorFixer };