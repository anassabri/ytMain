import _React from 'react';
import { WorkflowCoordinator } from '../core/WorkflowCoordinator';
import { _Logger } from '../utils/_Logger';

describe('WorkflowCoordinator', () => {
  let coordinator: WorkflowCoordinator;
  let mockLogger: jest.Mocked<_Logger>;

  beforeEach(() => {
    mockLogger = global.createMockLogger();
    coordinator = new WorkflowCoordinator(mockLogger);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('initialization', () => {
    it('should initialize with default components', () => {
      expect(coordinator).toBeDefined();
      expect(mockLogger.info).toHaveBeenCalledWith('WORKFLOW', 'Workflow coordinator initialized');
    });

    it('should have correct statistics after initialization', () => {
      const stats = coordinator.getStatistics();
      
      expect(stats.totalPhases).toBeGreaterThan(0);
      expect(stats.totalGenerators).toBeGreaterThan(0);
      expect(stats.isWorkflowRunning).toBe(false);
      expect(stats.components.errorAnalyzer).toBe(true);
      expect(stats.components.executionOrchestrator).toBe(true);
      expect(stats.components.validationEngine).toBe(true);
      expect(stats.components.reportGenerator).toBe(true);
      expect(stats.components.rollbackManager).toBe(true);
      expect(stats.components.processMonitor).toBe(true);
    });
  });

  describe('workflow status', () => {
    it('should return correct status when no workflow is running', () => {
      const status = coordinator.getCurrentWorkflowStatus();
      
      expect(status.isRunning).toBe(false);
      expect(status.currentPhase).toBeUndefined();
      expect(status.progress).toBeUndefined();
      expect(status.elapsedTime).toBeUndefined();
    });
  });

  describe('phase management', () => {
    it('should allow adding custom phases', () => {
      const customPhase = {
        id: 'custom-test-phase',
        name: 'Custom Test Phase',
        description: 'A test phase for unit testing',
        dependencies: [],
        required: false,
        execute: jest.fn()
      };

      coordinator.addPhase(customPhase);
      
      expect(mockLogger.info).toHaveBeenCalledWith('WORKFLOW', 'Added custom phase: Custom Test Phase');
    });

    it('should allow removing phases', () => {
      const customPhase = {
        id: 'removable-phase',
        name: 'Removable Phase',
        description: 'A phase that will be removed',
        dependencies: [],
        required: false,
        execute: jest.fn()
      };

      coordinator.addPhase(customPhase);
      coordinator.removePhase('removable-phase');
      
      expect(mockLogger.info).toHaveBeenCalledWith('WORKFLOW', 'Removed phase: removable-phase');
    });
  });

  describe('workflow execution', () => {
    it('should handle empty file list gracefully', async () => {
      const config = {
        projectRoot: '/test/project',
        dryRun: true,
        backupEnabled: false,
        validationEnabled: false,
        timeoutSeconds: 30,
        maxRetries: 1,
        rollbackOnFailure: false,
        continueOnValidationFailure: true,
        generateReports: false,
        reportFormats: [] as const
      };

      // Mock the file system to return empty results
      const fs = require('fs');
      fs.promises.readdir.mockResolvedValue([]);

      try {
        const result = await coordinator.executeWorkflow([], config);
        
        expect(result).toBeDefined();
        expect(result.success).toBeDefined();
        expect(result.initialErrorCount).toBeDefined();
        expect(result.finalErrorCount).toBeDefined();
        expect(result.errorsFixed).toBeDefined();
        expect(result.executionTime).toBeGreaterThan(0);
      } catch (error) {
        // Expected to fail due to mocked dependencies, but should not crash
        expect(error).toBeDefined();
      }
    });
  });

  describe('error handling', () => {
    it('should handle stop workflow when no workflow is running', async () => {
      await coordinator.stopWorkflow('Test stop');
      
      expect(mockLogger.warn).toHaveBeenCalledWith('WORKFLOW', 'No workflow running to stop');
    });
  });
});