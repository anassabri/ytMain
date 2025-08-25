import _React from 'react';
// Logger - Minimal Implementation
export enum LogLevel {
  ERROR = 0,
  WARN = 1,
  INFO = 2,
  DEBUG = 3
}

export class Logger {
  private level: LogLevel;
  private isDevelopment: boolean;

  constructor(level: LogLevel = LogLevel.INFO) {
    this.level = level;
    this.isDevelopment = process.env.NODE_ENV === 'development';
  }

  private shouldLog(level: LogLevel): boolean {
    return level <= this.level;
  }

  private formatMessage(
    level: string,
    message: string,
    _data?: unknown
  ): string {
    const timestamp = new Date().toISOString();
    return timestamp + ' [' + level + '] ' + message;
  }

  error(message: string, error?: Error | unknown, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.ERROR)) {
      return;
    }

    const formatted = this.formatMessage('ERROR', message);
    console.error(formatted, error, ...args);
  }

  warn(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.WARN)) {
      return;
    }
    const formatted = this.formatMessage('WARN', message);
    console.warn(formatted, ...args);
  }

  info(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.INFO)) {
      return;
    }
    const formatted = this.formatMessage('INFO', message);
    console.info(formatted, ...args);
  }

  debug(message: string, ...args: unknown[]): void {
    if (!this.shouldLog(LogLevel.DEBUG)) {
      return;
    }
    const formatted = this.formatMessage('DEBUG', message);
    console.debug(formatted, ...args);
  }

  apiResponse(method: string, url: string, status: number, _data?: unknown): void {
    if (this.isDevelopment) {
      this.debug('API ' + method + ' ' + url + ' - ' + status, _data);
    }
  }

  userAction(action: string, _data?: Record<string, unknown>): void {
    this.info('User action: ' + action, _data);
  }

  performance(operation: string, duration: number): void {
    this.debug('Performance: ' + operation + ' took ' + duration + 'ms');
  }
}

export const logger = new Logger(
  process.env.NODE_ENV === 'development' ? LogLevel.DEBUG : LogLevel.INFO
);

export default logger;