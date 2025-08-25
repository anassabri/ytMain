import _React from 'react';

import { Command } from 'commander';
import { logger } from '../../utils/logger';
import { ErrorAnalyzer } from '../core/ErrorAnalyzer';
import { ExecutionOrchestrator } from '../core/ExecutionOrchestrator';
import { ValidationEngine } from '../core/ValidationEngine';

const program = new Command();

program
  .name('error-resolver')
  .description('Automated TypeScript error resolution system')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze TypeScript errors in the project')
  .option('-p, --project <path>', 'Path to tsconfig.json', './tsconfig.json')
  .option('-o, --output <file>', 'Output file for analysis results', 'error-analysis.json')
  .action(async (options) => {
    logger.info('Starting TypeScript error analysis...');
    logger.info(`Project: ${options.project}`);
    
    try {
      const analyzer = new ErrorAnalyzer();
      const result = await analyzer.analyzeErrors();
      
      // Save analysis result
      await analyzer.saveAnalysisResult(result, options.output);
      
      // Display summary
      console.log('\n📊 Analysis Summary:');
      console.log(`Total Errors: ${result.totalErrors}`);
      console.log(`Critical Files: ${result.criticalFiles.length}`);
      console.log(`Categories: ${result.errorsByCategory.size}`);
      
      // Show recommendations
      if (result.recommendations.length > 0) {
        console.log('\n💡 Recommendations:');
        result.recommendations.forEach(rec => console.log(`  ${rec}`));
      }
      
      logger.info('Error analysis completed successfully!');
      
    } catch (error: any) {
      logger.error(`Error during analysis: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('fix')
  .description('Automatically fix TypeScript errors')
  .option('-p, --project <path>', 'Path to tsconfig.json', './tsconfig.json')
  .option('--dry-run', 'Show what would be fixed without making changes')
  .option('--no-backup', 'Skip creating backups before making changes')
  .option('--timeout <seconds>', 'Timeout in seconds', '600')
  .action(async (options) => {
    logger.info('Starting automatic error fixing...');
    logger.info(`Project: ${options.project}`);
    logger.info(`Dry run: ${options.dryRun ? 'Yes' : 'No'}`);
    logger.info(`Backup: ${options.backup ? 'Yes' : 'No'}`);
    
    try {
      // Step 1: Analyze errors
      logger.info('Phase 1: Analyzing errors...');
      const analyzer = new ErrorAnalyzer();
      const analysis = await analyzer.analyzeErrors();
      
      if (analysis.totalErrors === 0) {
        logger.info('No errors found! Project is clean.');
        return;
      }
      
      // Step 2: Execute orchestrated fixes
      logger.info('Phase 2: Orchestrating fixes...');
      const orchestrator = new ExecutionOrchestrator({
        dryRun: options.dryRun,
        backupEnabled: options.backup,
        timeoutSeconds: parseInt(options.timeout),
        validationEnabled: true
      });
      
      const fixResult = await orchestrator.executeOrchestration(
        Array.from(analysis.errorsByCategory.values()).flat()
      );
      
      // Step 3: Final validation
      if (!options.dryRun) {
        logger.info('Phase 3: Final validation...');
        const validator = new ValidationEngine();
        const validation = await validator.validate();
        
        if (validation.overallSuccess) {
          logger.info('✅ All validations passed!');
        } else {
          logger.warn(`⚠️ Some validations failed (${validation.failedChecks}/${validation.totalChecks})`);
        }
      }
      
      logger.info(`Fix process completed: ${fixResult.message}`);
      
    } catch (error: any) {
      logger.error(`Error during fixing: ${error.message}`);
      process.exit(1);
    }
  });

program
  .command('validate')
  .description('Validate project after fixes')
  .option('-p, --project <path>', 'Path to tsconfig.json', './tsconfig.json')
  .action(async (options) => {
    logger.info('Running project validation...');
    logger.info(`Project: ${options.project}`);
    
    try {
      const validator = new ValidationEngine();
      const result = await validator.validate();
      
      if (result.overallSuccess) {
        logger.info('✅ All validation checks passed!');
      } else {
        logger.error(`❌ ${result.failedChecks} validation checks failed`);
        process.exit(1);
      }
      
    } catch (error: any) {
      logger.error(`Error during validation: ${error.message}`);
      process.exit(1);
    }
  });

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
}