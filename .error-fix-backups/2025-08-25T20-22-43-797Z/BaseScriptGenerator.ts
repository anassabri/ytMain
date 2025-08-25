import { AnalyzedError, FixingScript, ScriptCommand, ValidationCheck } from '../types/ErrorTypes';

export interface GenerationContext {
  targetFiles: string[];
  errorCount: number;
  timeoutSeconds: number;
  dryRun: boolean;
  backupEnabled: boolean;
  errors?: AnalyzedError[];
}

export interface ScriptTemplate {
  id: string;
  name: string;
  description: string;
  parameters: TemplateParameter[];
  commands: ScriptCommand[];
  validationChecks: ValidationCheck[];
}

export interface TemplateParameter {
  name: string;
  type: 'string' | 'number' | 'boolean';
  description: string;
  required: boolean;
  defaultValue?;
}

export abstract class BaseScriptGenerator {
  protected category: string;
  protected templates: Map<string, ScriptTemplate> = new Map();

  constructor(category: string) {
    this.category = category;
    this.initializeTemplates();
  }

  protected abstract initializeTemplates(): void;

  protected addTemplate(template: ScriptTemplate): void {
    this.templates.set(template.id, template);
  }

  protected abstract groupErrorsByPattern(errors: AnalyzedError[]): Map<string, AnalyzedError[]>;

  protected abstract generateScriptForPattern(
    pattern: string,
    errors: AnalyzedError[],
    context: GenerationContext
  ): Promise<FixingScript | null>;

  public async generateScript(
    errors: AnalyzedError[],
    context: GenerationContext
  ): Promise<FixingScript[]> {
    const scripts: FixingScript[] = [];
    const errorGroups = this.groupErrorsByPattern(errors);

    for (const [pattern, patternErrors] of errorGroups) {
      const script = await this.generateScriptForPattern(pattern, patternErrors, context);
      if (script) {
        scripts.push(script);
      }
    }

    return scripts;
  }

  protected generateUniqueId(): string {
    return `${this.category}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }

  protected createValidationCheck(
    type: 'syntax' | 'compilation' | 'test' | 'lint',
    command: string,
    expectedResult: 'success' | 'zero-errors' | 'improved-count' = 'improved-count',
    timeoutSeconds: number = 30
  ): ValidationCheck {
    return {
      type,
      command,
      expectedResult,
      timeoutSeconds
    };
  }

  protected createTypeValidationChecks(files: string[]): ValidationCheck[] {
    return files.map(file => this.createValidationCheck(
      'compilation',
      `npx tsc --noEmit ${file}`,
      'zero-errors'
    ));
  }

  protected generateRollbackCommands(commands: ScriptCommand[]): ScriptCommand[] {
    // Generate rollback commands for the given commands
    return commands.map(cmd => ({
      type: cmd.type,
      file: cmd.file,
      description: `Rollback for: ${cmd.description}`
    }));
  }

  protected estimateRuntime(commands: ScriptCommand[]): number {
    // Estimate runtime in seconds based on command count and type
    return commands.length * 5; // 5 seconds per command as rough estimate
  }
}

export default BaseScriptGenerator;