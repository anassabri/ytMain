import _React from 'react';
import * as fs from 'fs';
import * as path from 'path';
import { _execSync } from 'child_process';

export interface CacheCleanupResult {
  filesDeleted: string[];
  directoriesDeleted: string[];
  totalSizeFreed: number;
  errors: string[];
}

export interface BackupInfo {
  id: string;
  timestamp: Date;
  description: string;
  files: string[];
  backupPath: string;
}

export class CacheManager {
  private backupDir: string;
  private maxBackups: number;

  constructor(backupDir = '.error-fix-backups', maxBackups = 10) {
    this.backupDir = backupDir;
    this.maxBackups = maxBackups;
    this.ensureBackupDirectory();
  }

  /**
   * Cleans up TypeScript build cache and temporary files
   */
  public async cleanupTypeScriptCache(): Promise<CacheCleanupResult> {
    console.log('🧹 Starting TypeScript cache cleanup...');
    
    const result: CacheCleanupResult = {
      filesDeleted: [],
      directoriesDeleted: [],
      totalSizeFreed: 0,
      errors: []
    };

    const cacheTargets = [
      // TypeScript build info files
      'tsconfig.tsbuildinfo',
      '.tsbuildinfo',
      
      // Node modules cache
      'node_modules/.cache',
      
      // Vite cache
      'node_modules/.vite',
      
      // Build directories
      'dist',
      'build',
      
      // Temporary files
      '*.tmp',
      '*.temp',
      
      // Error analysis files (old ones)
      'error-analysis-*.json',
      'type-errors-*.txt',
      'ts-errors-*.txt',
      
      // Coverage directories
      'coverage',
      '.nyc_output'
    ];

    for (const target of cacheTargets) {
      try {
        await this.cleanupTarget(target, result);
      } catch (error) {
        const errorMsg = `Failed to cleanup ${target}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
        console.warn(`⚠️ ${errorMsg}`);
      }
    }

    console.log(`✅ Cache cleanup complete. Freed ${this.formatBytes(result.totalSizeFreed)}`);
    return result;
  }

  /**
   * Deletes files containing cached errors or temporary artifacts
   */
  public async deleteErrorFiles(): Promise<CacheCleanupResult> {
    console.log('🗑️ Deleting error cache files...');
    
    const result: CacheCleanupResult = {
      filesDeleted: [],
      directoriesDeleted: [],
      totalSizeFreed: 0,
      errors: []
    };

    const errorFilePatterns = [
      // Error analysis files
      'error-analysis*.json',
      'comprehensive-error-analysis*.json',
      'enhanced-error-analysis*.json',
      'phase*-error-analysis.json',
      
      // Error logs
      '*.error.log',
      'typescript-errors*.txt',
      'type-errors*.txt',
      'fresh-type-errors*.txt',
      'ts-errors*.txt',
      'type-check-output*.txt',
      
      // Fix reports
      '*-fixes-report.json',
      '*-fixes.log',
      'fix-*.js',
      
      // Orchestration reports
      'orchestration*.json',
      'orchestration*.txt',
      'orchestration*.md',
      
      // Temporary strategy files
      'tmp_*',
      'TYPESCRIPT_ERROR_RESOLUTION*.md',
      'systematic-typescript-error-resolution*.md'
    ];

    for (const pattern of errorFilePatterns) {
      try {
        await this.deleteFilesByPattern(pattern, result);
      } catch (error) {
        const errorMsg = `Failed to delete files matching ${pattern}: ${error instanceof Error ? error.message : 'Unknown error'}`;
        result.errors.push(errorMsg);
        console.warn(`⚠️ ${errorMsg}`);
      }
    }

    console.log(`✅ Error file cleanup complete. Deleted ${result.filesDeleted.length} files`);
    return result;
  }

  /**
   * Creates a backup of specified files before making changes
   */
  public async createBackup(files: string[], description: string): Promise<BackupInfo> {
    const backupId = `backup-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    const timestamp = new Date();
    const backupPath = path.join(this.backupDir, backupId);

    console.log(`💾 Creating backup: ${description}`);

    try {
      // Create backup directory
      await fs.promises.mkdir(backupPath, { recursive: true });

      const backedUpFiles: string[] = [];

      for (const file of files) {
        if (await this.fileExists(file)) {
          const relativePath = path.relative(process.cwd(), file);
          const backupFilePath = path.join(backupPath, relativePath);
          
          // Ensure backup subdirectory exists
          await fs.promises.mkdir(path.dirname(backupFilePath), { recursive: true });
          
          // Copy file to backup
          await fs.promises.copyFile(file, backupFilePath);
          backedUpFiles.push(file);
        }
      }

      // Create backup metadata
      const backupInfo: BackupInfo = {
        id: backupId,
        timestamp,
        description,
        files: backedUpFiles,
        backupPath
      };

      const metadataPath = path.join(backupPath, 'backup-info.json');
      await fs.promises.writeFile(metadataPath, JSON.stringify(backupInfo, null, 2));

      console.log(`✅ Backup created: ${backupId} (${backedUpFiles.length} files)`);
      
      // Cleanup old backups
      await this.cleanupOldBackups();

      return backupInfo;

    } catch (error) {
      console.error(`❌ Backup creation failed: ${error}`);
      throw error;
    }
  }

  /**
   * Restores files from a backup
   */
  public async restoreBackup(backupId: string): Promise<void> {
    const backupPath = path.join(this.backupDir, backupId);
    const metadataPath = path.join(backupPath, 'backup-info.json');

    console.log(`🔄 Restoring backup: ${backupId}`);

    try {
      // Read backup metadata
      const metadataContent = await fs.promises.readFile(metadataPath, 'utf8');
      const backupInfo: BackupInfo = JSON.parse(metadataContent);

      let restoredCount = 0;

      for (const originalFile of backupInfo.files) {
        const relativePath = path.relative(process.cwd(), originalFile);
        const backupFilePath = path.join(backupPath, relativePath);

        if (await this.fileExists(backupFilePath)) {
          // Ensure target directory exists
          await fs.promises.mkdir(path.dirname(originalFile), { recursive: true });
          
          // Restore file
          await fs.promises.copyFile(backupFilePath, originalFile);
          restoredCount++;
        }
      }

      console.log(`✅ Backup restored: ${restoredCount} files restored`);

    } catch (error) {
      console.error(`❌ Backup restoration failed: ${error}`);
      throw error;
    }
  }

  /**
   * Lists available backups
   */
  public async listBackups(): Promise<BackupInfo[]> {
    const backups: BackupInfo[] = [];

    try {
      if (!await this.fileExists(this.backupDir)) {
        return backups;
      }

      const entries = await fs.promises.readdir(this.backupDir);

      for (const entry of entries) {
        const metadataPath = path.join(this.backupDir, entry, 'backup-info.json');
        
        if (await this.fileExists(metadataPath)) {
          try {
            const metadataContent = await fs.promises.readFile(metadataPath, 'utf8');
            const backupInfo: BackupInfo = JSON.parse(metadataContent);
            backups.push(backupInfo);
          } catch (error) {
            console.warn(`⚠️ Failed to read backup metadata: ${entry}`);
          }
        }
      }

      // Sort by timestamp (newest first)
      backups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    } catch (error) {
      console.warn(`⚠️ Failed to list backups: ${error}`);
    }

    return backups;
  }

  /**
   * Cleans up a specific cache target
   */
  private async cleanupTarget(target: string, result: CacheCleanupResult): Promise<void> {
    const fullPath = path.resolve(target);

    if (await this.fileExists(fullPath)) {
      const stats = await fs.promises.stat(fullPath);

      if (stats.isDirectory()) {
        const size = await this.getDirectorySize(fullPath);
        await fs.promises.rm(fullPath, { recursive: true, force: true });
        result.directoriesDeleted.push(fullPath);
        result.totalSizeFreed += size;
        console.log(`🗂️ Deleted directory: ${target} (${this.formatBytes(size)})`);
      } else {
        const size = stats.size;
        await fs.promises.unlink(fullPath);
        result.filesDeleted.push(fullPath);
        result.totalSizeFreed += size;
        console.log(`📄 Deleted file: ${target} (${this.formatBytes(size)})`);
      }
    }
  }

  /**
   * Deletes files matching a pattern
   */
  private async deleteFilesByPattern(pattern: string, result: CacheCleanupResult): Promise<void> {
    try {
      // Use glob-like pattern matching with find command (cross-platform)
      const files = await this.findFilesByPattern(pattern);

      for (const file of files) {
        try {
          const stats = await fs.promises.stat(file);
          const size = stats.size;
          
          await fs.promises.unlink(file);
          result.filesDeleted.push(file);
          result.totalSizeFreed += size;
          
          console.log(`🗑️ Deleted: ${file}`);
        } catch (error) {
          result.errors.push(`Failed to delete ${file}: ${error}`);
        }
      }
    } catch (error) {
      result.errors.push(`Pattern matching failed for ${pattern}: ${error}`);
    }
  }

  /**
   * Finds files matching a pattern
   */
  private async findFilesByPattern(pattern: string): Promise<string[]> {
    const files: string[] = [];
    
    try {
      // Simple pattern matching - look for files in current directory
      const entries = await fs.promises.readdir('.');
      
      for (const entry of entries) {
        if (this.matchesPattern(entry, pattern)) {
          const fullPath = path.resolve(entry);
          if (await this.fileExists(fullPath)) {
            const stats = await fs.promises.stat(fullPath);
            if (stats.isFile()) {
              files.push(fullPath);
            }
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Pattern search failed: ${error}`);
    }

    return files;
  }

  /**
   * Simple pattern matching (supports * wildcards)
   */
  private matchesPattern(filename: string, pattern: string): boolean {
    // Convert glob pattern to regex
    const regexPattern = pattern
      .replace(/\./g, '\\.')
      .replace(/\*/g, '.*')
      .replace(/\?/g, '.');
    
    const regex = new RegExp(`^${regexPattern}$`, 'i');
    return regex.test(filename);
  }

  /**
   * Ensures backup directory exists
   */
  private async ensureBackupDirectory(): Promise<void> {
    try {
      await fs.promises.mkdir(this.backupDir, { recursive: true });
    } catch (error) {
      console.warn(`⚠️ Failed to create backup directory: ${error}`);
    }
  }

  /**
   * Cleans up old backups to maintain max backup limit
   */
  private async cleanupOldBackups(): Promise<void> {
    try {
      const backups = await this.listBackups();
      
      if (backups.length > this.maxBackups) {
        const backupsToDelete = backups.slice(this.maxBackups);
        
        for (const backup of backupsToDelete) {
          const backupPath = path.join(this.backupDir, backup.id);
          await fs.promises.rm(backupPath, { recursive: true, force: true });
          console.log(`🗑️ Deleted old backup: ${backup.id}`);
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to cleanup old backups: ${error}`);
    }
  }

  /**
   * Checks if a file or directory exists
   */
  private async fileExists(filePath: string): Promise<boolean> {
    try {
      await fs.promises.access(filePath);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Gets the total size of a directory
   */
  private async getDirectorySize(dirPath: string): Promise<number> {
    let totalSize = 0;

    try {
      const entries = await fs.promises.readdir(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dirPath, entry.name);

        if (entry.isDirectory()) {
          totalSize += await this.getDirectorySize(fullPath);
        } else {
          const stats = await fs.promises.stat(fullPath);
          totalSize += stats.size;
        }
      }
    } catch (error) {
      console.warn(`⚠️ Failed to calculate directory size: ${dirPath}`);
    }

    return totalSize;
  }

  /**
   * Formats bytes to human readable format
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}