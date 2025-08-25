import _React from 'react';
import { execSync } from 'child_process';
import * as fs from 'fs';

// Error categorization interfaces and enums
export enum ErrorRootCause {
  FORMATTING = 1,    // Highest priority - safe to fix first
  SYNTAX = 2,        // Second priority - enables other fixes
  IMPORT = 3,        // Third priority - resolves dependencies
  TYPE = 4,          // Fourth priority - complex type issues
  LOGIC = 5          // Lowest priority - requires careful analysis
}

export enum ErrorSeverity {
  CRITICAL = 'critical',  // Blocks compilation completely
  HIGH = 'high',         // Causes major functionality issues
  MEDIUM = 'medium',     // Causes minor issues or warnings
  LOW = 'low'           // Style or optimization issues
}

export interface ErrorCategory {
  name: string;
  priority: number;
  pattern: RegExp;
  rootCause: ErrorRootCause;
  fixingStrategy: 'bulk' | 'individual' | 'template';
  description: string;
}

export interface AnalyzedError {
  file: string;
  line: number;
  column: number;
  message: string;
  code: string;
  category: ErrorCategory;
  severity: ErrorSeverity;
  dependencies: string[];
  rawError: string;
}

export interface ErrorAnalysisResult {
  totalErrors: number;
  errorsByCategory: Map<string, AnalyzedError[]>;
  errorsByFile: Map<string, AnalyzedError[]>;
  errorsBySeverity: Map<ErrorSeverity, AnalyzedError[]>;
  criticalFiles: string[];
  recommendations: string[];
}

export class ErrorAnalyzer {
  private errorCategories: ErrorCategory[] = [
    // Syntax errors (highest priority)
    {
      name: 'Missing Semicolon',
      priority: 1,
      pattern: /TS1005.*';' expected/,
      rootCause: ErrorRootCause.SYNTAX,
      fixingStrategy: 'bulk',
      description: 'Missing semicolons in TypeScript code'
    },
    {
      name: 'Missing Comma',
      priority: 1,
      pattern: /TS1005.*',' expected/,
      rootCause: ErrorRootCause.SYNTAX,
      fixingStrategy: 'bulk',
      description: 'Missing commas in object literals, arrays, or function parameters'
    },
    {
      name: 'Missing Brace',
      priority: 1,
      pattern: /TS1005.*'}' expected/,
      rootCause: ErrorRootCause.SYNTAX,
      fixingStrategy: 'individual',
      description: 'Missing closing braces in code blocks'
    },
    {
      name: 'Invalid Syntax',
      priority: 1,
      pattern: /TS1128.*Declaration or statement expected/,
      rootCause: ErrorRootCause.SYNTAX,
      fixingStrategy: 'individual',
      description: 'Invalid syntax that prevents parsing'
    },
    {
      name: 'Property Assignment Expected',
      priority: 1,
      pattern: /TS1136.*Property assignment expected/,
      rootCause: ErrorRootCause.SYNTAX,
      fixingStrategy: 'individual',
      description: 'Invalid property assignment syntax in objects'
    },
    
    // Import/Export errors
    {
      name: 'Cannot Find Module',
      priority: 2,
      pattern: /TS2307.*Cannot find module/,
      rootCause: ErrorRootCause.IMPORT,
      fixingStrategy: 'individual',
      description: 'Missing or incorrect import paths'
    },
    {
      name: 'Module Resolution',
      priority: 2,
      pattern: /TS2305.*Module.*has no exported member/,
      rootCause: ErrorRootCause.IMPORT,
      fixingStrategy: 'individual',
      description: 'Importing non-existent exports from modules'
    },
    
    // Type errors
    {
      name: 'Property Does Not Exist',
      priority: 3,
      pattern: /TS2339.*Property.*does not exist/,
      rootCause: ErrorRootCause.TYPE,
      fixingStrategy: 'individual',
      description: 'Accessing properties that do not exist on types'
    },
    {
      name: 'Type Assignment',
      priority: 3,
      pattern: /TS2322.*Type.*is not assignable to type/,
      rootCause: ErrorRootCause.TYPE,
      fixingStrategy: 'individual',
      description: 'Type compatibility issues in assignments'
    },
    {
      name: 'Missing Type Parameter',
      priority: 3,
      pattern: /TS2314.*Generic type.*requires.*type argument/,
      rootCause: ErrorRootCause.TYPE,
      fixingStrategy: 'template',
      description: 'Generic types missing required type parameters'
    },
    
    // Logic errors
    {
      name: 'Possibly Undefined',
      priority: 4,
      pattern: /TS2532.*Object is possibly 'undefined'/,
      rootCause: ErrorRootCause.LOGIC,
      fixingStrategy: 'individual',
      description: 'Potential undefined access requiring null checks'
    },
    {
      name: 'Unreachable Code',
      priority: 4,
      pattern: /TS7027.*Unreachable code detected/,
      rootCause: ErrorRootCause.LOGIC,
      fixingStrategy: 'individual',
      description: 'Code that will never be executed'
    }
  ];

  /**
   * Captures and analyzes all TypeScript compilation errors
   */
  public async analyzeErrors(): Promise<ErrorAnalysisResult> {
    console.log('🔍 Starting TypeScript error analysis...');
    
    try {
      // Capture TypeScript errors
      const rawErrors = this.captureTypeScriptErrors();
      
      // Parse and categorize errors
      const analyzedErrors = this.parseAndCategorizeErrors(rawErrors);
      
      // Generate analysis result
      const result = this.generateAnalysisResult(analyzedErrors);
      
      console.log(`📊 Analysis complete: ${result.totalErrors} errors found`);
      return result;
      
    } catch (error) {
      console.error('❌ Error analysis failed:', error);
      throw error;
    }
  }

  /**
   * Captures TypeScript compilation errors by running tsc
   */
  private captureTypeScriptErrors(): string {
    try {
      console.log('🏃 Running TypeScript compilation to capture errors...');
      
      // Run TypeScript compiler and capture output
      execSync('npx tsc --noEmit --skipLibCheck', { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      return ''; // No errors if we reach here
      
    } catch (error: any) {
      // TypeScript errors are captured in stderr
      return error.stdout || error.stderr || '';
    }
  }

  /**
   * Parses raw TypeScript error output and categorizes each error
   */
  private parseAndCategorizeErrors(rawOutput: string): AnalyzedError[] {
    const errors: AnalyzedError[] = [];
    const lines = rawOutput.split('\n');
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip empty lines and non-error lines
      if (!line || !line.includes(' - error TS')) {
        continue;
      }
      
      try {
        const parsedError = this.parseErrorLine(line);
        if (parsedError) {
          errors.push(parsedError);
        }
      } catch (parseError) {
        console.warn(`⚠️ Failed to parse error line: ${line}`);
      }
    }
    
    return errors;
  }

  /**
   * Parses a single error line into an AnalyzedError object
   */
  private parseErrorLine(errorLine: string): AnalyzedError | null {
    // TypeScript error format: _file.ts:line:column - error TSxxxx: _message
    const errorRegex = /^(.+):(\d+):(\d+)\s*-\s*error\s+(TS\d+):\s*(.+)$/;
    const match = errorLine.match(errorRegex);
    
    if (!match) {
      return null;
    }
    
    const [, file, lineStr, columnStr, code, message] = match;
    const line = parseInt(lineStr, 10);
    const column = parseInt(columnStr, 10);
    
    // Categorize the error
    const category = this.categorizeError(code, message);
    const severity = this.determineSeverity(code, message, category);
    
    return {
      file: file.trim(),
      line,
      column,
      message: message.trim(),
      code,
      category,
      severity,
      dependencies: this.extractDependencies(file, message),
      rawError: errorLine
    };
  }

  /**
   * Categorizes an error based on its code and message
   */
  private categorizeError(code: string, message: string): ErrorCategory {
    // Try to match against known error patterns
    for (const category of this.errorCategories) {
      if (category.pattern.test(`${code}: ${message}`)) {
        return category;
      }
    }
    
    // Default category for unrecognized errors
    return {
      name: 'Unknown Error',
      priority: 5,
      pattern: /.*/,
      rootCause: ErrorRootCause.LOGIC,
      fixingStrategy: 'individual',
      description: 'Unrecognized error type requiring manual analysis'
    };
  }

  /**
   * Determines error severity based on code and context
   */
  private determineSeverity(_code: string, _message: string, category: ErrorCategory): ErrorSeverity {
    // Critical syntax errors that prevent compilation
    if (category.rootCause === ErrorRootCause.SYNTAX) {
      return ErrorSeverity.CRITICAL;
    }
    
    // Import errors are high priority
    if (category.rootCause === ErrorRootCause.IMPORT) {
      return ErrorSeverity.HIGH;
    }
    
    // Type errors are medium priority
    if (category.rootCause === ErrorRootCause.TYPE) {
      return ErrorSeverity.MEDIUM;
    }
    
    // Logic errors are low priority
    return ErrorSeverity.LOW;
  }

  /**
   * Extracts file dependencies from error context
   */
  private extractDependencies(_file: string, message: string): string[] {
    const dependencies: string[] = [];
    
    // Extract imported module names from error messages
    const moduleMatch = message.match(/module ['"]([^'"]+)['"]/);
    if (moduleMatch) {
      dependencies.push(moduleMatch[1]);
    }
    
    // Extract file references
    const fileMatch = message.match(/in file ['"]([^'"]+)['"]/);
    if (fileMatch) {
      dependencies.push(fileMatch[1]);
    }
    
    return dependencies;
  }

  /**
   * Generates comprehensive analysis result from parsed errors
   */
  private generateAnalysisResult(errors: AnalyzedError[]): ErrorAnalysisResult {
    const errorsByCategory = new Map<string, AnalyzedError[]>();
    const errorsByFile = new Map<string, AnalyzedError[]>();
    const errorsBySeverity = new Map<ErrorSeverity, AnalyzedError[]>();
    const criticalFiles: string[] = [];
    
    // Group errors by various criteria
    for (const error of errors) {
      // By category
      const categoryKey = error.category.name;
      if (!errorsByCategory.has(categoryKey)) {
        errorsByCategory.set(categoryKey, []);
      }
      errorsByCategory.get(categoryKey)!.push(error);
      
      // By file
      if (!errorsByFile.has(error.file)) {
        errorsByFile.set(error.file, []);
      }
      errorsByFile.get(error.file)!.push(error);
      
      // By severity
      if (!errorsBySeverity.has(error.severity)) {
        errorsBySeverity.set(error.severity, []);
      }
      errorsBySeverity.get(error.severity)!.push(error);
      
      // Track critical files
      if (error.severity === ErrorSeverity.CRITICAL && !criticalFiles.includes(error.file)) {
        criticalFiles.push(error.file);
      }
    }
    
    // Generate recommendations
    const recommendations = this.generateRecommendations(errorsByCategory, criticalFiles);
    
    return {
      totalErrors: errors.length,
      errorsByCategory,
      errorsByFile,
      errorsBySeverity,
      criticalFiles,
      recommendations
    };
  }

  /**
   * Generates actionable recommendations based on error analysis
   */
  private generateRecommendations(
    errorsByCategory: Map<string, AnalyzedError[]>,
    criticalFiles: string[]
  ): string[] {
    const recommendations: string[] = [];
    
    // Critical file recommendations
    if (criticalFiles.length > 0) {
      recommendations.push(
        `🚨 CRITICAL: ${criticalFiles.length} files have syntax errors preventing compilation. Fix these first: ${criticalFiles.slice(0, 5).join(', ')}`
      );
    }
    
    // Category-specific recommendations
    for (const [categoryName, errors] of Array.from(errorsByCategory.entries())) {
      if (errors.length > 10) {
        const category = errors[0].category;
        recommendations.push(
          `📦 ${categoryName}: ${errors.length} errors found. Strategy: ${category.fixingStrategy} fixing recommended.`
        );
      }
    }
    
    // Priority recommendations
    const syntaxErrors = Array.from(errorsByCategory.values())
      .flat()
      .filter(e => e.category.rootCause === ErrorRootCause.SYNTAX);
      
    if (syntaxErrors.length > 0) {
      recommendations.push(
        `⚡ Fix ${syntaxErrors.length} syntax errors first to enable proper TypeScript parsing`
      );
    }
    
    return recommendations;
  }

  /**
   * Saves analysis result to a JSON file for further processing
   */
  public async saveAnalysisResult(result: ErrorAnalysisResult, outputPath: string): Promise<void> {
    const serializedResult = {
      totalErrors: result.totalErrors,
      errorsByCategory: Object.fromEntries(result.errorsByCategory),
      errorsByFile: Object.fromEntries(result.errorsByFile),
      errorsBySeverity: Object.fromEntries(result.errorsBySeverity),
      criticalFiles: result.criticalFiles,
      recommendations: result.recommendations,
      timestamp: new Date().toISOString()
    };
    
    await fs.promises.writeFile(
      outputPath,
      JSON.stringify(serializedResult, null, 2),
      'utf8'
    );
    
    console.log(`💾 Analysis result saved to: ${outputPath}`);
  }
}