#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Fresh TypeScript Error Resolution System
 * Deploys and runs the Real TypeScript Error Resolution System to get fresh critical errors
 */

class FreshErrorResolutionSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.error-fix-backups', new Date().toISOString().replace(/[:.]/g, '-'));
    this.errorsFixed = 0;
    this.report = {
      timestamp: new Date().toISOString(),
      system: 'Fresh TypeScript Error Resolution System',
      initialErrors: 0,
      finalErrors: 0,
      errorsFixed: 0,
      categories: {},
      criticalFiles: [],
      fixesApplied: []
    };
  }

  async run() {
    console.log('🚀 Starting Fresh TypeScript Error Resolution System...');
    
    try {
      // Phase 1: Get fresh critical errors
      console.log('\n📊 Phase 1: Analyzing Fresh Critical Errors...');
      const freshErrors = await this.getFreshCriticalErrors();
      
      // Phase 2: Categorize and prioritize errors
      console.log('\n🔍 Phase 2: Categorizing and Prioritizing Errors...');
      const analysis = this.analyzeErrors(freshErrors);
      
      // Phase 3: Create targeted fix script
      console.log('\n🛠️ Phase 3: Creating Targeted Fix Script...');
      await this.createTargetedFixScript(analysis);
      
      // Phase 4: Execute fixes with error handling
      console.log('\n⚡ Phase 4: Executing Fixes with Error Handling...');
      await this.executeFixesWithErrorHandling(analysis);
      
      // Phase 5: Validate and report
      console.log('\n✅ Phase 5: Final Validation and Reporting...');
      await this.validateAndReport();
      
    } catch (error) {
      console.error('❌ Error Resolution System failed:', error.message);
      process.exit(1);
    }
  }

  async getFreshCriticalErrors() {
    console.log('🔍 Running TypeScript compilation to capture fresh errors...');
    
    try {
      execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ No TypeScript errors found!');
      return [];
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || '';
      const errors = this.parseTypeScriptErrors(errorOutput);
      
      console.log(`📈 Found ${errors.length} fresh TypeScript errors`);
      this.report.initialErrors = errors.length;
      
      return errors;
    }
  }

  parseTypeScriptErrors(output) {
    const errors = [];
    const lines = output.split('\n');
    
    for (const line of lines) {
      if (line.includes(': error TS')) {
        // TypeScript error format: file.ts(line,column): error TSxxxx: message
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

  analyzeErrors(errors) {
    const analysis = {
      total: errors.length,
      byFile: new Map(),
      byCode: new Map(),
      bySeverity: new Map(),
      criticalFiles: [],
      patterns: new Map()
    };
    
    // Group by file
    for (const error of errors) {
      if (!analysis.byFile.has(error.file)) {
        analysis.byFile.set(error.file, []);
      }
      analysis.byFile.get(error.file).push(error);
      
      // Count by error code
      if (!analysis.byCode.has(error.code)) {
        analysis.byCode.set(error.code, 0);
      }
      analysis.byCode.set(error.code, analysis.byCode.get(error.code) + 1);
      
      // Categorize by severity
      const severity = this.getSeverity(error.code, error.message);
      if (!analysis.bySeverity.has(severity)) {
        analysis.bySeverity.set(severity, []);
      }
      analysis.bySeverity.get(severity).push(error);
      
      // Find patterns
      const pattern = this.getPattern(error.code, error.message);
      if (!analysis.patterns.has(pattern)) {
        analysis.patterns.set(pattern, []);
      }
      analysis.patterns.get(pattern).push(error);
    }
    
    // Identify critical files
    for (const [file, fileErrors] of analysis.byFile) {
      const criticalCount = fileErrors.filter(e => this.getSeverity(e.code, e.message) === 'critical').length;
      if (criticalCount > 5) {
        analysis.criticalFiles.push({ file, criticalCount, totalErrors: fileErrors.length });
      }
    }
    
    analysis.criticalFiles.sort((a, b) => b.criticalCount - a.criticalCount);
    
    console.log(`📊 Analysis Summary:`);
    console.log(`  Total Errors: ${analysis.total}`);
    console.log(`  Files Affected: ${analysis.byFile.size}`);
    console.log(`  Critical Files: ${analysis.criticalFiles.length}`);
    console.log(`  Error Patterns: ${analysis.patterns.size}`);
    
    this.report.categories = Object.fromEntries(analysis.byCode);
    this.report.criticalFiles = analysis.criticalFiles.map(f => f.file);
    
    return analysis;
  }

  getSeverity(code, message) {
    // Critical syntax errors that prevent compilation
    const criticalPatterns = [
      /TS1005.*expected/,
      /TS1128.*Declaration or statement expected/,
      /TS1003.*Identifier expected/,
      /TS1109.*Expression expected/,
      /TS1110.*Type expected/,
      /TS1434.*Unexpected token/
    ];
    
    for (const pattern of criticalPatterns) {
      if (pattern.test(`${code}: ${message}`)) {
        return 'critical';
      }
    }
    
    // Import/export errors
    if (code.startsWith('TS23') && (message.includes('Cannot find module') || message.includes('has no exported member'))) {
      return 'import';
    }
    
    // Type errors
    if (code.startsWith('TS23') || code.startsWith('TS70') || code.startsWith('TS25')) {
      return 'type';
    }
    
    // Unused variables
    if (code === 'TS6133') {
      return 'unused';
    }
    
    return 'other';
  }

  getPattern(code, message) {
    if (code === 'TS6133') return 'unused-declarations';
    if (code === 'TS7006') return 'implicit-any';
    if (code === 'TS2339') return 'property-not-found';
    if (code === 'TS2307') return 'module-not-found';
    if (code === 'TS2305') return 'no-exported-member';
    if (code === 'TS1005') return 'syntax-errors';
    if (code === 'TS2724') return 'wrong-export-name';
    if (code === 'TS2722') return 'possibly-undefined-call';
    
    return `${code}-general`;
  }

  async createTargetedFixScript(analysis) {
    const fixScript = {
      name: 'targeted-fresh-error-fixes',
      timestamp: new Date().toISOString(),
      patterns: []
    };
    
    // Create fixes for each pattern
    for (const [pattern, errors] of analysis.patterns) {
      if (errors.length > 0) {
        const patternFix = this.createPatternFix(pattern, errors);
        if (patternFix) {
          fixScript.patterns.push(patternFix);
        }
      }
    }
    
    // Save the fix script
    const scriptPath = path.join(this.projectRoot, 'fresh-error-fix-script.json');
    fs.writeFileSync(scriptPath, JSON.stringify(fixScript, null, 2));
    
    console.log(`📄 Created targeted fix script: ${scriptPath}`);
    console.log(`🎯 Script contains ${fixScript.patterns.length} fix patterns`);
    
    return fixScript;
  }

  createPatternFix(pattern, errors) {
    console.log(`🔧 Creating fix for pattern: ${pattern} (${errors.length} errors)`);
    
    switch (pattern) {
      case 'unused-declarations':
        return this.createUnusedDeclarationsFix(errors);
      case 'implicit-any':
        return this.createImplicitAnyFix(errors);
      case 'module-not-found':
        return this.createModuleNotFoundFix(errors);
      case 'no-exported-member':
        return this.createNoExportedMemberFix(errors);
      case 'wrong-export-name':
        return this.createWrongExportNameFix(errors);
      case 'property-not-found':
        return this.createPropertyNotFoundFix(errors);
      case 'syntax-errors':
        return this.createSyntaxErrorsFix(errors);
      case 'possibly-undefined-call':
        return this.createPossiblyUndefinedCallFix(errors);
      default:
        return null;
    }
  }

  createUnusedDeclarationsFix(errors) {
    return {
      pattern: 'unused-declarations',
      description: 'Remove unused imports and declarations',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'remove-or-prefix',
        original: this.extractUnusedIdentifier(error.message),
        action: 'Remove unused import or prefix with underscore'
      }))
    };
  }

  createImplicitAnyFix(errors) {
    return {
      pattern: 'implicit-any',
      description: 'Add explicit type annotations',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'add-type',
        parameter: this.extractParameterName(error.message),
        action: 'Add type annotation or any type'
      }))
    };
  }

  createModuleNotFoundFix(errors) {
    return {
      pattern: 'module-not-found',
      description: 'Fix module import paths',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'fix-import',
        module: this.extractModuleName(error.message),
        action: 'Fix import path or install missing package'
      }))
    };
  }

  createNoExportedMemberFix(errors) {
    return {
      pattern: 'no-exported-member',
      description: 'Fix imported member names',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'fix-export-name',
        member: this.extractExportMember(error.message),
        action: 'Fix exported member name or use default import'
      }))
    };
  }

  createWrongExportNameFix(errors) {
    return {
      pattern: 'wrong-export-name',
      description: 'Fix wrong export names with suggestions',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'fix-wrong-export',
        wrongName: this.extractWrongExportName(error.message),
        suggestion: this.extractSuggestedName(error.message),
        action: 'Use suggested export name'
      }))
    };
  }

  createPropertyNotFoundFix(errors) {
    return {
      pattern: 'property-not-found',
      description: 'Fix property access errors',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'fix-property',
        property: this.extractPropertyName(error.message),
        action: 'Add optional chaining or fix property name'
      }))
    };
  }

  createSyntaxErrorsFix(errors) {
    return {
      pattern: 'syntax-errors',
      description: 'Fix syntax errors',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'fix-syntax',
        expected: this.extractExpectedToken(error.message),
        action: 'Add missing syntax token'
      }))
    };
  }

  createPossiblyUndefinedCallFix(errors) {
    return {
      pattern: 'possibly-undefined-call',
      description: 'Fix possibly undefined function calls',
      fixes: errors.map(error => ({
        file: error.file,
        line: error.line,
        type: 'add-null-check',
        action: 'Add null check or optional chaining'
      }))
    };
  }

  // Helper extraction methods
  extractUnusedIdentifier(message) {
    const match = message.match(/'([^']+)' is declared but/);
    return match ? match[1] : '';
  }

  extractParameterName(message) {
    const match = message.match(/Parameter '([^']+)' implicitly/);
    return match ? match[1] : '';
  }

  extractModuleName(message) {
    const match = message.match(/Cannot find module '([^']+)'/);
    return match ? match[1] : '';
  }

  extractExportMember(message) {
    const match = message.match(/has no exported member '([^']+)'/);
    return match ? match[1] : '';
  }

  extractWrongExportName(message) {
    const match = message.match(/no exported member named '([^']+)'/);
    return match ? match[1] : '';
  }

  extractSuggestedName(message) {
    const match = message.match(/Did you mean '([^']+)'/);
    return match ? match[1] : '';
  }

  extractPropertyName(message) {
    const match = message.match(/Property '([^']+)' does not exist/);
    return match ? match[1] : '';
  }

  extractExpectedToken(message) {
    const match = message.match(/'([^']+)' expected/);
    return match ? match[1] : '';
  }

  async executeFixesWithErrorHandling(analysis) {
    console.log('⚡ Executing targeted fixes with comprehensive error handling...');
    
    // Create backup first
    await this.createBackup(Array.from(analysis.byFile.keys()));
    
    let totalFixed = 0;
    
    // Execute fixes by priority
    const priorities = ['critical', 'import', 'type', 'unused', 'other'];
    
    for (const priority of priorities) {
      if (analysis.bySeverity.has(priority)) {
        const errors = analysis.bySeverity.get(priority);
        console.log(`🎯 Fixing ${priority} errors (${errors.length} items)...`);
        
        const fixed = await this.executeFixesForSeverity(priority, errors);
        totalFixed += fixed;
        
        // Validate after each priority
        const currentErrors = await this.getErrorCount();
        console.log(`✅ ${priority} fixes complete. Current error count: ${currentErrors}`);
      }
    }
    
    this.errorsFixed = totalFixed;
    console.log(`🎉 Total fixes applied: ${totalFixed}`);
  }

  async executeFixesForSeverity(severity, errors) {
    let fixed = 0;
    
    try {
      switch (severity) {
        case 'critical':
          fixed = await this.fixCriticalErrors(errors);
          break;
        case 'unused':
          fixed = await this.fixUnusedDeclarations(errors);
          break;
        case 'import':
          fixed = await this.fixImportErrors(errors);
          break;
        case 'type':
          fixed = await this.fixTypeErrors(errors);
          break;
        default:
          fixed = await this.fixOtherErrors(errors);
      }
    } catch (error) {
      console.warn(`⚠️ Error fixing ${severity} errors:`, error.message);
    }
    
    return fixed;
  }

  async fixUnusedDeclarations(errors) {
    let fixed = 0;
    
    // Group by file for efficient processing
    const byFile = new Map();
    for (const error of errors) {
      if (!byFile.has(error.file)) {
        byFile.set(error.file, []);
      }
      byFile.get(error.file).push(error);
    }
    
    for (const [filePath, fileErrors] of byFile) {
      try {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          const originalContent = content;
          
          for (const error of fileErrors) {
            const identifier = this.extractUnusedIdentifier(error.message);
            if (identifier) {
              // Remove unused imports
              content = content.replace(
                new RegExp(`import\\s*{[^}]*\\b${identifier}\\b[^}]*}\\s*from[^;]+;?`, 'g'),
                (match) => {
                  const remaining = match.replace(new RegExp(`\\b${identifier}\\b,?\\s*`, 'g'), '');
                  if (remaining.match(/{\s*}/)) {
                    return ''; // Remove entire import if empty
                  }
                  return remaining.replace(/,(\s*})/, '$1'); // Clean up trailing commas
                }
              );
              
              // Prefix unused variables with underscore
              content = content.replace(
                new RegExp(`\\b(const|let|var)\\s+${identifier}\\b`, 'g'),
                `$1 _${identifier}`
              );
              
              // Prefix unused parameters with underscore
              content = content.replace(
                new RegExp(`\\b${identifier}\\b(?=\\s*[,):])`, 'g'),
                `_${identifier}`
              );
            }
          }
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content);
            fixed += fileErrors.length;
            this.report.fixesApplied.push({
              type: 'unused-declarations',
              file: filePath,
              count: fileErrors.length
            });
          }
        }
      } catch (error) {
        console.warn(`⚠️ Error processing ${filePath}:`, error.message);
      }
    }
    
    return fixed;
  }

  async fixImportErrors(errors) {
    let fixed = 0;
    
    for (const error of errors) {
      try {
        if (fs.existsSync(error.file)) {
          let content = fs.readFileSync(error.file, 'utf8');
          const originalContent = content;
          
          if (error.code === 'TS2724') {
            // Fix wrong export names with suggestions
            const wrongName = this.extractWrongExportName(error.message);
            const suggestion = this.extractSuggestedName(error.message);
            
            if (wrongName && suggestion) {
              content = content.replace(
                new RegExp(`\\b${wrongName}\\b`, 'g'),
                suggestion
              );
            }
          } else if (error.code === 'TS2305') {
            // Remove non-existent exports
            const member = this.extractExportMember(error.message);
            if (member) {
              content = content.replace(
                new RegExp(`\\b${member}\\b,?\\s*`, 'g'),
                ''
              );
              content = content.replace(/{\s*,\s*}/g, '{}');
              content = content.replace(/,(\s*})/g, '$1');
            }
          }
          
          if (content !== originalContent) {
            fs.writeFileSync(error.file, content);
            fixed++;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Error fixing import in ${error.file}:`, err.message);
      }
    }
    
    this.report.fixesApplied.push({
      type: 'import-errors',
      count: fixed
    });
    
    return fixed;
  }

  async fixTypeErrors(errors) {
    let fixed = 0;
    
    for (const error of errors) {
      try {
        if (fs.existsSync(error.file)) {
          let content = fs.readFileSync(error.file, 'utf8');
          const originalContent = content;
          
          if (error.code === 'TS7006') {
            // Add any type to implicit any parameters
            const param = this.extractParameterName(error.message);
            if (param) {
              content = content.replace(
                new RegExp(`\\b${param}\\b(?=\\s*[,):])`, 'g'),
                `${param}: any`
              );
            }
          } else if (error.code === 'TS2722') {
            // Add optional chaining for possibly undefined calls
            content = content.replace(
              /(\w+)\s*\(/g,
              (match, funcName) => {
                if (error.message.includes('possibly \'undefined\'')) {
                  return `${funcName}?.(`;
                }
                return match;
              }
            );
          }
          
          if (content !== originalContent) {
            fs.writeFileSync(error.file, content);
            fixed++;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Error fixing type error in ${error.file}:`, err.message);
      }
    }
    
    this.report.fixesApplied.push({
      type: 'type-errors',
      count: fixed
    });
    
    return fixed;
  }

  async fixCriticalErrors(errors) {
    let fixed = 0;
    
    for (const error of errors) {
      try {
        if (fs.existsSync(error.file)) {
          let content = fs.readFileSync(error.file, 'utf8');
          const originalContent = content;
          
          if (error.code === 'TS1005') {
            const expected = this.extractExpectedToken(error.message);
            if (expected === ';') {
              // Add missing semicolons
              const lines = content.split('\n');
              if (lines[error.line - 1]) {
                lines[error.line - 1] = lines[error.line - 1].replace(/\s*$/, ';');
                content = lines.join('\n');
              }
            } else if (expected === ',') {
              // Add missing commas
              const lines = content.split('\n');
              if (lines[error.line - 1]) {
                lines[error.line - 1] = lines[error.line - 1].replace(/\s*$/, ',');
                content = lines.join('\n');
              }
            }
          }
          
          if (content !== originalContent) {
            fs.writeFileSync(error.file, content);
            fixed++;
          }
        }
      } catch (err) {
        console.warn(`⚠️ Error fixing critical error in ${error.file}:`, err.message);
      }
    }
    
    this.report.fixesApplied.push({
      type: 'critical-errors',
      count: fixed
    });
    
    return fixed;
  }

  async fixOtherErrors(errors) {
    // For now, just log other errors for manual review
    console.log(`📝 ${errors.length} other errors logged for manual review`);
    return 0;
  }

  async createBackup(files) {
    try {
      fs.mkdirSync(this.backupDir, { recursive: true });
      
      for (const file of files) {
        if (fs.existsSync(file)) {
          const backupFile = path.join(this.backupDir, path.basename(file));
          fs.copyFileSync(file, backupFile);
        }
      }
      
      console.log(`💾 Backup created: ${this.backupDir}`);
    } catch (error) {
      console.warn(`⚠️ Backup creation failed: ${error.message}`);
    }
  }

  async getErrorCount() {
    try {
      execSync('npx tsc --noEmit', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      return 0;
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || '';
      const errorLines = errorOutput.split('\n').filter(line => line.includes(': error TS'));
      return errorLines.length;
    }
  }

  async validateAndReport() {
    console.log('✅ Running final validation...');
    
    const finalErrors = await this.getErrorCount();
    this.report.finalErrors = finalErrors;
    this.report.errorsFixed = this.report.initialErrors - finalErrors;
    
    // Generate comprehensive report
    const reportPath = path.join(this.projectRoot, 'fresh-error-resolution-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.report, null, 2));
    
    console.log('\n🎉 Fresh Error Resolution System Complete!');
    console.log('='.repeat(50));
    console.log(`📊 Initial Errors: ${this.report.initialErrors}`);
    console.log(`📉 Final Errors: ${this.report.finalErrors}`);
    console.log(`🔧 Errors Fixed: ${this.report.errorsFixed}`);
    console.log(`📄 Report saved: ${reportPath}`);
    
    if (this.report.finalErrors === 0) {
      console.log('🏆 Perfect! All TypeScript errors resolved!');
    } else {
      console.log(`📝 ${this.report.finalErrors} errors remaining for manual review`);
    }
  }
}

// Run the system
if (require.main === module) {
  const system = new FreshErrorResolutionSystem();
  system.run().catch(error => {
    console.error('❌ System failed:', error);
    process.exit(1);
  });
}

module.exports = { FreshErrorResolutionSystem };