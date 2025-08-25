import { CacheManager } from '../core/CacheManager';
import { FileManager } from '../utils/FileManager';
import * as fs from 'fs';
import * as _path from '_path';

// Mock fs module for testing
jest.mock('fs', () => ({
  promises: {
    mkdir: jest.fn(),
    readdir: jest.fn(),
    stat: jest.fn(),
    unlink: jest.fn(),
    rm: jest.fn(),
    copyFile: jest.fn(),
    writeFile: jest.fn(),
    readFile: jest.fn(),
    access: jest.fn()
  }
}));

describe('CacheManager', () => {
  let cacheManager: CacheManager;
  const mockFs = fs.promises as jest.Mocked<typeof fs.promises>;

  beforeEach(() => {
    cacheManager = new CacheManager('.test-backups', 5);
    jest.clearAllMocks();
  });

  describe('Cache Cleanup', () => {
    it('should clean up TypeScript cache files', async () => {
      // Mock file existence and stats
      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat.mockResolvedValue({
        isDirectory: () => false,
        size: 1024
      });

      const result = await cacheManager.cleanupTypeScriptCache();

      expect(result.filesDeleted.length).toBeGreaterThan(0);
      expect(result.totalSizeFreed).toBeGreaterThan(0);
      expect(mockFs.unlink).toHaveBeenCalled();
    });

    it('should handle cleanup errors gracefully', async () => {
      // Mock file access to throw error
      mockFs.access.mockRejectedValue(new Error('File not found'));

      const result = await cacheManager.cleanupTypeScriptCache();

      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.filesDeleted.length).toBe(0);
    });

    it('should delete error files by pattern', async () => {
      // Mock readdir to return matching files
      mockFs.readdir.mockResolvedValue(['error-analysis.json', 'other-file.txt']);
      mockFs.access.mockResolvedValue(undefined);
      mockFs.stat.mockResolvedValue({
        isFile: () => true,
        size: 512
      });

      const result = await cacheManager.deleteErrorFiles();

      expect(result.filesDeleted.length).toBeGreaterThan(0);
      expect(mockFs.unlink).toHaveBeenCalled();
    });
  });

  describe('Backup Management', () => {
    it('should create backup successfully', async () => {
      const testFiles = ['test1.ts', 'test2.ts'];
      
      // Mock file operations
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.access.mockResolvedValue(undefined);
      mockFs.copyFile.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const backup = await cacheManager.createBackup(testFiles, 'Test backup');

      expect(backup.id).toBeDefined();
      expect(backup.description).toBe('Test backup');
      expect(backup.files).toEqual(testFiles);
      expect(mockFs.mkdir).toHaveBeenCalled();
      expect(mockFs.copyFile).toHaveBeenCalledTimes(testFiles.length);
      expect(mockFs.writeFile).toHaveBeenCalled();
    });

    it('should restore backup successfully', async () => {
      const backupId = 'test-backup-123';
      const mockBackupInfo = {
        id: backupId,
        timestamp: new Date(),
        description: 'Test backup',
        files: ['test1.ts', 'test2.ts'],
        backupPath: `.test-backups/${backupId}`
      };

      // Mock backup metadata reading
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockBackupInfo));
      mockFs.access.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.copyFile.mockResolvedValue(undefined);

      await cacheManager.restoreBackup(backupId);

      expect(mockFs.readFile).toHaveBeenCalled();
      expect(mockFs.copyFile).toHaveBeenCalledTimes(mockBackupInfo.files.length);
    });

    it('should list available backups', async () => {
      const mockBackupInfo = {
        id: 'backup-123',
        timestamp: new Date(),
        description: 'Test backup',
        files: ['test.ts'],
        backupPath: '.test-backups/backup-123'
      };

      // Mock directory listing and metadata reading
      mockFs.access.mockResolvedValue(undefined);
      mockFs.readdir.mockResolvedValue(['backup-123']);
      mockFs.readFile.mockResolvedValue(JSON.stringify(mockBackupInfo));

      const backups = await cacheManager.listBackups();

      expect(backups.length).toBe(1);
      expect(backups[0].id).toBe('backup-123');
      expect(backups[0].description).toBe('Test backup');
    });

    it('should handle backup creation failure', async () => {
      const testFiles = ['nonexistent.ts'];
      
      // Mock file access to fail
      mockFs.access.mockRejectedValue(new Error('File not found'));
      mockFs.mkdir.mockResolvedValue(undefined);

      await expect(cacheManager.createBackup(testFiles, 'Test backup'))
        .rejects.toThrow();
    });
  });

  describe('Pattern Matching', () => {
    it('should match wildcard patterns correctly', () => {
      const cacheManagerAny = cacheManager;
      
      expect(cacheManagerAny.matchesPattern('error-analysis.json', 'error-*.json')).toBe(true);
      expect(cacheManagerAny.matchesPattern('test.txt', '*.txt')).toBe(true);
      expect(cacheManagerAny.matchesPattern('file.js', '*.ts')).toBe(false);
      expect(cacheManagerAny.matchesPattern('prefix-file-suffix.log', '*-file-*.log')).toBe(true);
    });
  });

  describe('Utility Functions', () => {
    it('should format bytes correctly', () => {
      const cacheManagerAny = cacheManager;
      
      expect(cacheManagerAny.formatBytes(0)).toBe('0 Bytes');
      expect(cacheManagerAny.formatBytes(1024)).toBe('1 KB');
      expect(cacheManagerAny.formatBytes(1048576)).toBe('1 MB');
      expect(cacheManagerAny.formatBytes(1073741824)).toBe('1 GB');
    });

    it('should check file existence', async () => {
      const cacheManagerAny = cacheManager;
      
      // Mock successful access
      mockFs.access.mockResolvedValue(undefined);
      expect(await cacheManagerAny.fileExists('existing-file.ts')).toBe(true);
      
      // Mock failed access
      mockFs.access.mockRejectedValue(new Error('File not found'));
      expect(await cacheManagerAny.fileExists('nonexistent-file.ts')).toBe(false);
    });
  });
});

describe('FileManager', () => {
  let fileManager: FileManager;
  const mockFs = fs.promises as jest.Mocked<typeof fs.promises>;

  beforeEach(() => {
    fileManager = new FileManager();
    jest.clearAllMocks();
  });

  describe('File Operations', () => {
    it('should perform create operation successfully', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found')); // File doesn't exist
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const operations = [{
        type: 'create' as const,
        source: 'new-file.ts',
        content: 'console.log("Hello World");'
      }];

      const results = await fileManager.performOperations(operations);

      expect(results[0].success).toBe(true);
      expect(mockFs.writeFile).toHaveBeenCalledWith('new-file.ts', 'console.log("Hello World");', 'utf8');
    });

    it('should perform update operation with backup', async () => {
      mockFs.access.mockResolvedValue(undefined); // File exists
      mockFs.copyFile.mockResolvedValue(undefined);
      mockFs.writeFile.mockResolvedValue(undefined);

      const operations = [{
        type: 'update' as const,
        source: 'existing-file.ts',
        content: 'console.log("Updated");',
        backup: true
      }];

      const results = await fileManager.performOperations(operations);

      expect(results[0].success).toBe(true);
      expect(results[0].backupPath).toBeDefined();
      expect(mockFs.copyFile).toHaveBeenCalled(); // Backup created
      expect(mockFs.writeFile).toHaveBeenCalledWith('existing-file.ts', 'console.log("Updated");', 'utf8');
    });

    it('should perform delete operation with backup', async () => {
      mockFs.access.mockResolvedValue(undefined); // File exists
      mockFs.copyFile.mockResolvedValue(undefined);
      mockFs.unlink.mockResolvedValue(undefined);

      const operations = [{
        type: 'delete' as const,
        source: 'file-to-delete.ts',
        backup: true
      }];

      const results = await fileManager.performOperations(operations);

      expect(results[0].success).toBe(true);
      expect(results[0].backupPath).toBeDefined();
      expect(mockFs.copyFile).toHaveBeenCalled(); // Backup created
      expect(mockFs.unlink).toHaveBeenCalledWith('file-to-delete.ts');
    });

    it('should rollback operations on failure', async () => {
      // First operation succeeds, second fails
      mockFs.access
        .mockResolvedValueOnce(undefined) // First file exists (delete)
        .mockRejectedValueOnce(new Error('File not found')); // Second file doesn't exist (update fails)
      
      mockFs.copyFile.mockResolvedValue(undefined);
      mockFs.unlink.mockResolvedValue(undefined);
      mockFs.rename.mockResolvedValue(undefined); // For rollback

      const operations = [
        {
          type: 'delete' as const,
          source: 'file1.ts',
          backup: true
        },
        {
          type: 'update' as const,
          source: 'nonexistent.ts',
          content: 'test'
        }
      ];

      const results = await fileManager.performOperations(operations);

      expect(results[0].success).toBe(true);
      expect(results[1].success).toBe(false);
      // Rollback should have been attempted
    });
  });

  describe('File Validation', () => {
    it('should validate TypeScript files', async () => {
      const tsContent = `
        import React from 'react';
        const test: string = "hello"
        console.log(test);
      `;

      mockFs.access.mockResolvedValue(undefined);
      mockFs.readFile.mockResolvedValue(tsContent);

      const result = await fileManager.validateFile('test.ts');

      expect(result.isValid).toBe(true);
      expect(result.warnings.length).toBeGreaterThan(0); // Should warn about missing semicolon and console.log
    });

    it('should validate JSON files', async () => {
      const validJson = '{"name": "test", "version": "1.0.0"}';
      const invalidJson = '{"name": "test", "version":}';

      mockFs.access.mockResolvedValue(undefined);
      
      // Valid JSON
      mockFs.readFile.mockResolvedValue(validJson);
      let result = await fileManager.validateFile('valid.json');
      expect(result.isValid).toBe(true);

      // Invalid JSON
      mockFs.readFile.mockResolvedValue(invalidJson);
      result = await fileManager.validateFile('invalid.json');
      expect(result.isValid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle file validation errors', async () => {
      mockFs.access.mockRejectedValue(new Error('File not found'));

      const result = await fileManager.validateFile('nonexistent.ts');

      expect(result.isValid).toBe(false);
      expect(result.errors[0]).toContain('File does not exist');
    });
  });

  describe('Safe Operations', () => {
    it('should safely delete multiple files', async () => {
      const filesToDelete = ['file1.ts', 'file2.ts'];
      
      mockFs.access.mockResolvedValue(undefined);
      mockFs.copyFile.mockResolvedValue(undefined);
      mockFs.unlink.mockResolvedValue(undefined);

      const results = await fileManager.safeDelete(filesToDelete, true);

      expect(results.length).toBe(2);
      expect(results.every(r => r.success)).toBe(true);
      expect(mockFs.unlink).toHaveBeenCalledTimes(2);
    });

    it('should safely copy files to target directory', async () => {
      const sourceFiles = ['src/file1.ts', 'src/file2.ts'];
      const targetDir = 'backup';

      mockFs.access.mockResolvedValue(undefined);
      mockFs.mkdir.mockResolvedValue(undefined);
      mockFs.copyFile.mockResolvedValue(undefined);

      const results = await fileManager.safeCopy(sourceFiles, targetDir);

      expect(results.length).toBe(2);
      expect(results.every(r => r.success)).toBe(true);
      expect(mockFs.copyFile).toHaveBeenCalledTimes(2);
    });
  });
});