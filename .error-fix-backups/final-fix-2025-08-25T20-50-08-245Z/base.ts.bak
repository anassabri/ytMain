// base - Enhanced Implementation
export interface BaseConfig {
  enabled: boolean;
  options: Record<string, any>;
}

export class Base {
  private config: BaseConfig;

  constructor(config?: Partial<BaseConfig>) {
    this.config = {
      enabled: true,
      options: {},
      ...config
    };
  }

  isEnabled(): boolean {
    return this.config.enabled;
  }

  updateConfig(newConfig: Partial<BaseConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): BaseConfig {
    return { ...this.config };
  }
}

export const base = new Base();
export default base;