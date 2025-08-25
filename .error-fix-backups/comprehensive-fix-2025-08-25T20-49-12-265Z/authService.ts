// authService - Advanced Service Implementation
export interface authServiceConfig {
  baseUrl?: string;
  timeout?: number;
}

export class AuthService {
  private config: Required<authServiceConfig>;

  constructor(config: authServiceConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api',
      timeout: config.timeout || 5000
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = this.config.baseUrl + endpoint;
    
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      });

      if (!response.ok) {
        throw new Error('Request failed: ' + response.status);
      }

      return await response.json();
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data: any)
    });
  }
}

export const authService = new AuthService();
export default authService;