import _React from 'react';
import { execSync } from 'child_process';

export interface ValidationCheck {
  name: string;
  type: 'syntax' | 'lint' | 'build' | 'test';
  command: string;
  timeout: number;
  required: boolean;
}

export interface ValidationResult {
  check: ValidationCheck;
  success: boolean;
  message: string;
  details?: any;
  executionTime: number;
}

export interface ValidationSummary {
  overallSuccess: boolean;
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  results: ValidationResult[];
  totalTime: number;
  recommendations: string[];
}

export class ValidationEngine {
  private checks: ValidationCheck[] = [
    {
      name: 'TypeScript Compilation',
      type: 'syntax',
      command: 'npx tsc --noEmit --skipLibCheck',
      timeout: 60,
      required: true
    },
    {
      name: 'ESLint Check',
      type: 'lint',
      command: 'npx eslint src --ext .ts,.tsx --max-warnings 0',
      timeout: 30,
      required: false
    },
    {
      name: 'Build Check',
      type: 'build',
      command: 'npm run build',
      timeout: 120,
      required: false
    }
  ];

  /**
   * Runs all validation checks
   */
  public async validate(): Promise<ValidationSummary> {
    console.log('🔍 Starting validation checks...');
    
    const startTime = Date.now();
    const results: ValidationResult[] = [];
    
    for (const check of this.checks) {
      const result = await this.runValidationCheck(check);
      results.push(result);
      
      // Stop on required check failure
      if (!result.success && check.required) {
        console.log(`❌ Required check ${check.name} failed, stopping validation`);
        break;
      }
    }
    
    const totalTime = Date.now() - startTime;
    const passedChecks = results.filter(r => r.success).length;
    const failedChecks = results.length - passedChecks;
    const overallSuccess = results.every(r => r.success || !r.check.required);
    
    const summary: ValidationSummary = {
      overallSuccess,
      totalChecks: results.length,
      passedChecks,
      failedChecks,
      results,
      totalTime,
      recommendations: this.generateRecommendations(results)
    };
    
    this.logValidationSummary(summary);
    return summary;
  }

  /**
   * Runs a single validation check
   */
  private async runValidationCheck(check: ValidationCheck): Promise<ValidationResult> {
    console.log(`🔧 Running ${check.name}...`);
    
    const startTime = Date.now();
    
    try {
      const output = execSync(check.command, {
        encoding: 'utf8',
        timeout: check.timeout * 1000,
        stdio: 'pipe'
      });
      
      const executionTime = Date.now() - startTime;
      
      return {
        check,
        success: true,
        message: `${check.name} passed successfully`,
        details: { output: output.slice(0, 500) }, // Limit output length
        executionTime
      };
      
    } catch (error: any) {
      const executionTime = Date.now() - startTime;
      const errorOutput = error.stdout || error.stderr || error.message || '';
      
      // Analyze error for specific issues
      const analysis = this.analyzeValidationError(check, errorOutput);
      
      return {
        check,
        success: false,
        message: analysis.message,
        details: {
          error: errorOutput.slice(0, 1000), // Limit error output
          analysis: analysis.details
        },
        executionTime
      };
    }
  }

  /**
   * Analyzes validation errors for specific recommendations
   */
  private analyzeValidationError(check: ValidationCheck, errorOutput: string): { message: string; details: any } {
    const analysis = {
      message: `${check.name} failed`,
      details: {}
    };
    
    switch (check.type) {
      case 'syntax':
        return this.analyzeSyntaxErrors(errorOutput);
      case 'lint':
        return this.analyzeLintErrors(errorOutput);
      case 'build':
        return this.analyzeBuildErrors(errorOutput);
      default:
        return analysis;
    }
  }

  /**
   * Analyzes TypeScript syntax errors
   */
  private analyzeSyntaxErrors(errorOutput: string): { message: string; details: any } {
    const errorLines = errorOutput.split('\n').filter((line: string) => line.includes(' - error TS'));
    const errorCount = errorLines.length;
    
    if (errorCount === 0) {
      return {
        message: 'TypeScript compilation passed',
        details: { errorCount: 0 }
      };
    }
    
    // Categorize errors by type
    const errorTypes = new Map<string, number>();
    
    for (const line of errorLines) {
      const tsCodeMatch = line.match(/TS(\d+)/);
      if (tsCodeMatch) {
        const errorCode = `TS${tsCodeMatch[1]}`;
        errorTypes.set(errorCode, (errorTypes.get(errorCode) || 0) + 1);
      }
    }
    
    const topErrors = Array.from(errorTypes.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);
    
    return {
      message: `TypeScript compilation failed with ${errorCount} errors`,
      details: {
        errorCount,
        topErrorTypes: topErrors,
        sampleErrors: errorLines.slice(0, 3)
      }
    };
  }

  /**
   * Analyzes ESLint errors
   */
  private analyzeLintErrors(errorOutput: string): { message: string; details: any } {
    const problemCount = this.extractNumber(errorOutput, /(\d+) problems?/);
    const errorCount = this.extractNumber(errorOutput, /(\d+) errors?/);
    const warningCount = this.extractNumber(errorOutput, /(\d+) warnings?/);
    
    return {
      message: `ESLint found ${problemCount || 0} problems`,
      details: {
        problems: problemCount || 0,
        errors: errorCount || 0,
        warnings: warningCount || 0
      }
    };
  }

  /**
   * Analyzes build errors
   */
  private analyzeBuildErrors(errorOutput: string): { message: string; details: any } {
    const buildFailed = errorOutput.includes('Build failed') || 
                       errorOutput.includes('error') ||
                       errorOutput.includes('Error:');
    
    return {
      message: buildFailed ? 'Build failed' : 'Build completed with warnings',
      details: {
        failed: buildFailed,
        output: errorOutput.slice(0, 500)
      }
    };
  }

  /**
   * Extracts number from text using regex
   */
  private extractNumber(text: string, regex: RegExp): number | null {
    const match = text.match(regex);
    return match ? parseInt(match[1], 10) : null;
  }

  /**
   * Generates recommendations based on validation results
   */
  private generateRecommendations(results: ValidationResult[]): string[] {
    const recommendations: string[] = [];
    
    for (const result of results) {
      if (!result.success) {
        switch (result.check.type) {
          case 'syntax':
            recommendations.push(
              '🔧 Fix TypeScript syntax errors first - they prevent other tools from working properly'
            );
            break;
          case 'lint':
            recommendations.push(
              '📝 Run ESLint with --fix flag to automatically fix common style issues'
            );
            break;
          case 'build':
            recommendations.push(
              '🏗️ Build issues may indicate missing dependencies or configuration problems'
            );
            break;
        }
      }
    }
    
    if (recommendations.length === 0) {
      recommendations.push('✅ All validation checks passed - project is in good shape!');
    }
    
    return recommendations;
  }

  /**
   * Logs validation summary to console
   */
  private logValidationSummary(summary: ValidationSummary): void {
    console.log('\n📊 Validation Summary');
    console.log('='.repeat(50));
    console.log(`Overall Status: ${summary.overallSuccess ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Total Checks: ${summary.totalChecks}`);
    console.log(`Passed: ${summary.passedChecks}`);
    console.log(`Failed: ${summary.failedChecks}`);
    console.log(`Total Time: ${Math.round(summary.totalTime / 1000)}s`);
    
    console.log('\n📋 Check Results:');
    for (const result of summary.results) {
      const status = result.success ? '✅' : '❌';
      const time = Math.round(result.executionTime / 1000);
      console.log(`${status} ${result.check.name} (${time}s) - ${result.message}`);
    }
    
    if (summary.recommendations.length > 0) {
      console.log('\n💡 Recommendations:');
      for (const recommendation of summary.recommendations) {
        console.log(`  ${recommendation}`);
      }
    }
  }

  /**
   * Adds a custom validation check
   */
  public addValidationCheck(check: ValidationCheck): void {
    this.checks.push(check);
  }

  /**
   * Removes a validation check by name
   */
  public removeValidationCheck(name: string): boolean {
    const index = this.checks.findIndex(check => check.name === name);
    if (index !== -1) {
      this.checks.splice(index, 1);
      return true;
    }
    return false;
  }

  /**
   * Gets all configured validation checks
   */
  public getValidationChecks(): ValidationCheck[] {
    return [...this.checks];
  }

  /**
   * Quick syntax validation only
   */
  public async quickSyntaxCheck(): Promise<boolean> {
    const syntaxCheck = this.checks.find(c => c.type === 'syntax');
    if (!syntaxCheck) {
      return true;
    }
    
    const result = await this.runValidationCheck(syntaxCheck);
    return result.success;
  }
}