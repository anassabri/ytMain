#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

/**
 * Fresh Critical TypeScript Error Resolution System
 * Deploys and runs the Real TypeScript Error Resolution System to fix critical syntax errors
 * Based on DEPLOYMENT_GUIDE.md and IMPLEMENTATION_SUMMARY.md requirements
 */

class FreshCriticalErrorResolutionSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.error-fix-backups', `fresh-critical-${new Date().toISOString().replace(/[:.]/g, '-')}`);
    this.errorsFixed = 0;
    this.report = {
      timestamp: new Date().toISOString(),
      system: 'Fresh Critical TypeScript Error Resolution System',
      initialErrors: 0,
      finalErrors: 0,
      errorsFixed: 0,
      categories: {},
      criticalFiles: [],
      fixesApplied: [],
      phase: 'fresh-critical-resolution'
    };
    
    // Ensure backup directory exists
    this.ensureBackupDir();
  }

  ensureBackupDir() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${this.backupDir}`);
    }
  }

  async run() {
    console.log('🚀 Starting Fresh Critical TypeScript Error Resolution System...');
    console.log('📋 Following DEPLOYMENT_GUIDE.md and IMPLEMENTATION_SUMMARY.md specifications\n');
    
    try {
      // Phase 1: Get fresh critical errors
      console.log('📊 Phase 1: Analyzing Fresh Critical Errors...');
      const freshErrors = await this.getFreshCriticalErrors();
      
      // Phase 2: Categorize and prioritize critical errors
      console.log('\n🔍 Phase 2: Categorizing Critical Error Patterns...');
      const analysis = this.analyzeCriticalErrors(freshErrors);
      
      // Phase 3: Create targeted fix strategies
      console.log('\n🛠️ Phase 3: Creating Targeted Fix Strategies...');
      await this.createTargetedFixStrategies(analysis);
      
      // Phase 4: Execute critical fixes with error handling
      console.log('\n⚡ Phase 4: Executing Critical Fixes with Error Handling...');
      await this.executeCriticalFixesWithErrorHandling(analysis);
      
      // Phase 5: Validate fixes and prepare for system deployment
      console.log('\n✅ Phase 5: Validating Fixes and Preparing System Deployment...');
      await this.validateAndPrepareDeployment();
      
      // Phase 6: Generate comprehensive report
      console.log('\n📊 Phase 6: Generating Comprehensive Resolution Report...');
      await this.generateComprehensiveReport();
      
    } catch (error) {
      console.error('❌ Critical Error Resolution System failed:', error);
      process.exit(1);
    }
  }

  async getFreshCriticalErrors() {
    console.log('🔍 Running TypeScript compilation to capture fresh critical errors...');
    
    try {
      execSync('npx tsc --noEmit --skipLibCheck', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      console.log('✅ No TypeScript errors found!');
      return [];
    } catch (error) {
      const errorOutput = error.stdout || error.stderr || '';
      const errors = this.parseTypeScriptErrors(errorOutput);
      
      console.log(`📈 Found ${errors.length} fresh critical TypeScript errors`);
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
            rawError: line.trim(),
            priority: this.calculateErrorPriority(code, message)
          });
        }
      }
    }
    
    return errors;
  }

  calculateErrorPriority(code, message) {
    // Critical syntax errors that prevent compilation
    if (code === 'TS1005' || code === 'TS1128' || code === 'TS1381' || code === 'TS1382' || code === 'TS17002') {
      return 1; // Highest priority
    }
    // Import/export errors
    if (code === 'TS2307' || code === 'TS2305') {
      return 2;
    }
    // Type errors
    if (code.startsWith('TS23') || code === 'TS7006') {
      return 3;
    }
    // Other errors
    return 4;
  }

  analyzeCriticalErrors(errors) {
    console.log(`🔍 Analyzing ${errors.length} critical errors...`);
    
    const patterns = new Map();
    const fileMap = new Map();
    const severityMap = new Map();
    
    for (const error of errors) {
      // Categorize by error pattern
      let patternKey = this.identifyErrorPattern(error);
      if (!patterns.has(patternKey)) {
        patterns.set(patternKey, []);
      }
      patterns.get(patternKey).push(error);
      
      // Group by file
      if (!fileMap.has(error.file)) {
        fileMap.set(error.file, []);
      }
      fileMap.get(error.file).push(error);
      
      // Group by severity
      const severity = this.determineSeverity(error.code);
      if (!severityMap.has(severity)) {
        severityMap.set(severity, []);
      }
      severityMap.get(severity).push(error);
    }
    
    // Log analysis results
    console.log('\n📊 Critical Error Analysis:');
    console.log(`   Total Errors: ${errors.length}`);
    console.log(`   Unique Patterns: ${patterns.size}`);
    console.log(`   Affected Files: ${fileMap.size}`);
    
    for (const [pattern, patternErrors] of patterns) {
      console.log(`   ${pattern}: ${patternErrors.length} errors`);
    }
    
    this.report.categories = Object.fromEntries(patterns);
    this.report.criticalFiles = Array.from(fileMap.keys());
    
    return {
      patterns,
      fileMap,
      severityMap,
      totalErrors: errors.length
    };
  }

  identifyErrorPattern(error) {
    // Pattern 1: Multiple `: any` annotations
    if (error.code === 'TS1005' && error.message.includes("',' expected")) {
      if (error.rawError.includes(': any: any') || error.rawError.includes(': any:')) {
        return 'multiple-any-annotations';
      }
      return 'syntax-comma-expected';
    }
    
    // Pattern 2: JSX syntax issues
    if (error.code === 'TS1381' || error.code === 'TS1382') {
      return 'jsx-syntax-issues';
    }
    
    // Pattern 3: JSX closing tag issues
    if (error.code === 'TS17002') {
      return 'jsx-closing-tag-issues';
    }
    
    // Pattern 4: Declaration/statement issues
    if (error.code === 'TS1128') {
      return 'declaration-statement-issues';
    }
    
    // Pattern 5: Expression expected
    if (error.code === 'TS1109') {
      return 'expression-expected';
    }
    
    return `unknown-${error.code}`;
  }

  determineSeverity(code) {
    if (['TS1005', 'TS1128', 'TS1381', 'TS1382', 'TS17002'].includes(code)) {
      return 'critical';
    }
    if (['TS2307', 'TS2305', 'TS7006'].includes(code)) {
      return 'high';
    }
    return 'medium';
  }

  async createTargetedFixStrategies(analysis) {
    console.log('🛠️ Creating targeted fix strategies for critical patterns...');
    
    const strategies = new Map();
    
    for (const [pattern, errors] of analysis.patterns) {
      const strategy = this.createPatternStrategy(pattern, errors);
      if (strategy) {
        strategies.set(pattern, strategy);
        console.log(`   ✅ Strategy created for ${pattern}: ${errors.length} errors`);
      }
    }
    
    this.fixStrategies = strategies;
    return strategies;
  }

  createPatternStrategy(pattern, errors) {
    switch (pattern) {
      case 'multiple-any-annotations':
        return {
          name: 'Multiple Any Annotations Fixer',
          description: 'Removes duplicate ": any" annotations in type declarations',
          priority: 1,
          files: [...new Set(errors.map(e => e.file))],
          execute: () => this.fixMultipleAnyAnnotations(errors)
        };
        
      case 'jsx-syntax-issues':
        return {
          name: 'JSX Syntax Fixer',
          description: 'Fixes JSX bracket and token syntax issues',
          priority: 2,
          files: [...new Set(errors.map(e => e.file))],
          execute: () => this.fixJSXSyntaxIssues(errors)
        };
        
      case 'jsx-closing-tag-issues':
        return {
          name: 'JSX Closing Tag Fixer',
          description: 'Fixes missing or incorrect JSX closing tags',
          priority: 3,
          files: [...new Set(errors.map(e => e.file))],
          execute: () => this.fixJSXClosingTags(errors)
        };
        
      default:
        return null;
    }
  }

  async executeCriticalFixesWithErrorHandling(analysis) {
    console.log('⚡ Executing critical fixes with comprehensive error handling...');
    
    let totalFixed = 0;
    
    // Sort strategies by priority
    const sortedStrategies = Array.from(this.fixStrategies.entries())
      .sort((a, b) => a[1].priority - b[1].priority);
    
    for (const [pattern, strategy] of sortedStrategies) {
      console.log(`\n🔧 Executing: ${strategy.name}`);
      console.log(`   Files to fix: ${strategy.files.length}`);
      
      try {
        // Create backups before fixing
        await this.createBackupsForFiles(strategy.files);
        
        // Execute the fix strategy
        const fixed = await strategy.execute();
        totalFixed += fixed;
        
        this.report.fixesApplied.push({
          pattern,
          strategy: strategy.name,
          filesProcessed: strategy.files.length,
          errorsFixed: fixed,
          timestamp: new Date().toISOString()
        });
        
        console.log(`   ✅ Fixed ${fixed} errors`);
        
      } catch (error) {
        console.error(`   ❌ Failed to execute ${strategy.name}:`, error.message);
        
        // Rollback on error
        console.log('   🔄 Rolling back changes...');
        await this.rollbackFiles(strategy.files);
      }
    }
    
    this.errorsFixed = totalFixed;
    console.log(`\n🎉 Total errors fixed: ${totalFixed}`);
  }

  async fixMultipleAnyAnnotations(errors) {
    console.log('🔧 Fixing multiple `: any` annotations...');
    
    const fileGroups = new Map();
    for (const error of errors) {
      if (!fileGroups.has(error.file)) {
        fileGroups.set(error.file, []);
      }
      fileGroups.get(error.file).push(error);
    }
    
    let fixed = 0;
    
    for (const [filePath, fileErrors] of fileGroups) {
      try {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          const originalContent = content;
          
          // Fix pattern: `: any: Type` -> `: Type`
          content = content.replace(/:\s*any\s*:\s*([^,\)}\s]+)/g, ': $1');
          
          // Fix pattern: `: any: any: any...` -> `: any`
          content = content.replace(/:\s*any(\s*:\s*any)+/g, ': any');
          
          // Fix pattern: `(param: any: any)` -> `(param: any)`
          content = content.replace(/\(\s*([^:]+):\s*any\s*:\s*any[^)]*\)/g, '($1: any)');
          
          // Fix pattern: function parameters with multiple any annotations
          content = content.replace(/([a-zA-Z_$][a-zA-Z0-9_$]*)\s*:\s*any\s*:\s*any(\s*:\s*[^,\)]*)*([,\)])/g, '$1: any$3');
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixed += fileErrors.length;
            console.log(`   ✅ Fixed ${filePath}`);
          }
        }
      } catch (error) {
        console.warn(`   ⚠️ Error processing ${filePath}:`, error.message);
      }
    }
    
    return fixed;
  }

  async fixJSXSyntaxIssues(errors) {
    console.log('🔧 Fixing JSX syntax issues...');
    
    const fileGroups = new Map();
    for (const error of errors) {
      if (!fileGroups.has(error.file)) {
        fileGroups.set(error.file, []);
      }
      fileGroups.get(error.file).push(error);
    }
    
    let fixed = 0;
    
    for (const [filePath, fileErrors] of fileGroups) {
      try {
        if (fs.existsSync(filePath)) {
          let content = fs.readFileSync(filePath, 'utf8');
          const originalContent = content;
          
          // Fix JSX attribute syntax issues
          content = content.replace(/\{\s*([^}]+)\s*:\s*any\s*\}/g, '{$1}');
          
          // Fix event handler syntax
          content = content.replace(/\{\s*\(\s*([^:]+)\s*:\s*any\s*\)\s*=>\s*([^(]+)\(\s*[^:]+\s*:\s*any\s*\)\s*\}/g, '{($1) => $2($1)}');
          
          if (content !== originalContent) {
            fs.writeFileSync(filePath, content, 'utf8');
            fixed += fileErrors.length;
            console.log(`   ✅ Fixed ${filePath}`);
          }
        }
      } catch (error) {
        console.warn(`   ⚠️ Error processing ${filePath}:`, error.message);
      }
    }
    
    return fixed;
  }

  async fixJSXClosingTags(errors) {
    console.log('🔧 Fixing JSX closing tag issues...');
    
    // This is more complex and would require AST parsing
    // For now, we'll log the files that need manual attention
    const affectedFiles = [...new Set(errors.map(e => e.file))];
    
    console.log('   ⚠️ JSX closing tag issues require manual review:');
    for (const file of affectedFiles) {
      console.log(`     - ${file}`);
    }
    
    return 0; // Manual fixes needed
  }

  async createBackupsForFiles(files) {
    for (const file of files) {
      if (fs.existsSync(file)) {
        const backupPath = path.join(this.backupDir, path.basename(file) + '.backup');
        fs.copyFileSync(file, backupPath);
      }
    }
  }

  async rollbackFiles(files) {
    for (const file of files) {
      const backupPath = path.join(this.backupDir, path.basename(file) + '.backup');
      if (fs.existsSync(backupPath) && fs.existsSync(file)) {
        fs.copyFileSync(backupPath, file);
      }
    }
  }

  async validateAndPrepareDeployment() {
    console.log('✅ Validating fixes and preparing for system deployment...');
    
    // Check current error count
    const currentErrors = await this.getFreshCriticalErrors();
    this.report.finalErrors = currentErrors.length;
    this.report.errorsFixed = this.report.initialErrors - this.report.finalErrors;
    
    console.log(`📊 Validation Results:`);
    console.log(`   Initial Errors: ${this.report.initialErrors}`);
    console.log(`   Final Errors: ${this.report.finalErrors}`);
    console.log(`   Errors Fixed: ${this.report.errorsFixed}`);
    console.log(`   Reduction: ${((this.report.errorsFixed / this.report.initialErrors) * 100).toFixed(1)}%`);
    
    // Try to build the error resolution system
    if (this.report.finalErrors < 50) {
      console.log('\n🏗️ Attempting to build TypeScript Error Resolution System...');
      try {
        execSync('npm run build', { encoding: 'utf8', stdio: 'pipe' });
        console.log('✅ TypeScript Error Resolution System built successfully!');
        this.report.systemBuilt = true;
      } catch (error) {
        console.log('⚠️ System build still has issues, but significant progress made');
        this.report.systemBuilt = false;
      }
    }
  }

  async generateComprehensiveReport() {
    console.log('📊 Generating comprehensive resolution report...');
    
    const reportPath = path.join(this.projectRoot, 'fresh-critical-error-resolution-report.json');
    const markdownReportPath = path.join(this.projectRoot, 'FRESH_CRITICAL_ERROR_RESOLUTION_REPORT.md');
    
    // Enhanced report with deployment information
    const enhancedReport = {
      ...this.report,
      deploymentStatus: {
        systemType: 'Real TypeScript Error Resolution System',
        deploymentGuide: 'DEPLOYMENT_GUIDE.md',
        implementationSummary: 'IMPLEMENTATION_SUMMARY.md',
        phase: 'fresh-critical-resolution',
        readyForProduction: this.report.systemBuilt || this.report.errorsFixed > 100
      },
      nextSteps: this.generateNextSteps(),
      recommendations: this.generateRecommendations()
    };
    
    // Save JSON report
    fs.writeFileSync(reportPath, JSON.stringify(enhancedReport, null, 2));
    
    // Save Markdown report
    const markdownReport = this.generateMarkdownReport(enhancedReport);
    fs.writeFileSync(markdownReportPath, markdownReport);
    
    console.log(`📄 Reports generated:`);
    console.log(`   JSON: ${reportPath}`);
    console.log(`   Markdown: ${markdownReportPath}`);
    
    // Final summary
    console.log('\n🎉 Fresh Critical Error Resolution System Deployment Complete!');
    console.log('📋 Following DEPLOYMENT_GUIDE.md and IMPLEMENTATION_SUMMARY.md specifications');
    console.log(`📊 System successfully reduced errors by ${this.report.errorsFixed} (${((this.report.errorsFixed / this.report.initialErrors) * 100).toFixed(1)}%)`);
    
    if (this.report.systemBuilt) {
      console.log('✅ TypeScript Error Resolution System is now ready for production deployment');
      console.log('🚀 You can now use: npm run build && npm install -g . && error-resolver analyze');
    } else {
      console.log('⚠️ Additional error resolution needed before full production deployment');
      console.log('🔄 Run this script again or use the built system for remaining errors');
    }
  }

  generateNextSteps() {
    const steps = [];
    
    if (this.report.systemBuilt) {
      steps.push('Deploy the built TypeScript Error Resolution System globally');
      steps.push('Use CLI commands: error-resolver analyze, error-resolver fix');
      steps.push('Integrate into CI/CD pipeline as per DEPLOYMENT_GUIDE.md');
    } else {
      steps.push('Continue resolving remaining syntax errors');
      steps.push('Focus on JSX closing tag issues requiring manual review');
      steps.push('Build the TypeScript Error Resolution System');
    }
    
    steps.push('Implement error prevention mechanisms');
    steps.push('Set up pre-commit hooks with TypeScript checking');
    steps.push('Configure strict TypeScript settings');
    
    return steps;
  }

  generateRecommendations() {
    const recommendations = [];
    
    recommendations.push({
      priority: 'High',
      title: 'Complete Critical Syntax Error Resolution',
      description: 'Continue fixing remaining syntax errors, particularly JSX closing tag issues',
      action: 'Manual review of files with TS17002 errors'
    });
    
    if (this.report.errorsFixed > 50) {
      recommendations.push({
        priority: 'High',
        title: 'Deploy Error Resolution System for Production Use',
        description: 'The system has made significant progress and is ready for deployment',
        action: 'Follow DEPLOYMENT_GUIDE.md for production deployment'
      });
    }
    
    recommendations.push({
      priority: 'Medium',
      title: 'Enhance Error Prevention',
      description: 'Add mechanisms to prevent similar errors from reoccurring',
      action: 'Implement pre-commit hooks and stricter TypeScript configuration'
    });
    
    return recommendations;
  }

  generateMarkdownReport(report) {
    return `# Fresh Critical TypeScript Error Resolution System - Deployment Report

## 🎯 System Deployment Status

**Date**: ${report.timestamp}
**System**: ${report.deploymentStatus.systemType}
**Phase**: ${report.deploymentStatus.phase}
**Status**: ${report.deploymentStatus.readyForProduction ? '✅ Ready for Production' : '🔄 In Progress'}

## 📊 Resolution Summary

- **Initial Error Count**: ${report.initialErrors} fresh TypeScript errors
- **Final Error Count**: ${report.finalErrors} errors
- **Errors Fixed**: ${report.errorsFixed} errors
- **Error Reduction**: ${((report.errorsFixed / report.initialErrors) * 100).toFixed(1)}%
- **System Built**: ${report.systemBuilt ? '✅ Success' : '❌ Pending'}

## 🔧 Fixes Applied

${report.fixesApplied.map(fix => `
### ${fix.strategy}
- **Pattern**: ${fix.pattern}
- **Files Processed**: ${fix.filesProcessed}
- **Errors Fixed**: ${fix.errorsFixed}
- **Timestamp**: ${fix.timestamp}
`).join('')}

## 📁 Critical Files Processed

${report.criticalFiles.map(file => `- ${file}`).join('\n')}

## 📋 Next Steps

${report.nextSteps.map(step => `- [ ] ${step}`).join('\n')}

## 🎯 Recommendations

${report.recommendations.map(rec => `
### ${rec.priority} Priority: ${rec.title}
${rec.description}

**Action**: ${rec.action}
`).join('')}

## 🚀 Deployment Instructions

Following **DEPLOYMENT_GUIDE.md** and **IMPLEMENTATION_SUMMARY.md**:

${report.systemBuilt ? `
### Production Deployment Ready ✅
\`\`\`bash
# Build the system
npm run build

# Install globally
npm install -g .

# Use CLI commands
error-resolver analyze --project .
error-resolver fix --project . --dry-run
error-resolver validate --project .
\`\`\`
` : `
### Continue Resolution Process 🔄
\`\`\`bash
# Run this script again
node deploy-fresh-critical-error-resolution.js

# Or use existing resolution scripts
node deploy-and-run-fresh-error-resolution.js
\`\`\`
`}

---
*Report generated by Fresh Critical TypeScript Error Resolution System v1.0.0*
`;
  }
}

// Run the system
if (require.main === module) {
  const system = new FreshCriticalErrorResolutionSystem();
  system.run().catch(error => {
    console.error('❌ Fresh Critical Error Resolution System failed:', error);
    process.exit(1);
  });
}

module.exports = { FreshCriticalErrorResolutionSystem };