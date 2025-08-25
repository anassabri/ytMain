// youtubeService - Clean Service Implementation
export interface youtubeServiceConfig {
  baseUrl?: string;
  timeout?: number;
}

export interface ServiceResponse<T = any> {
  data: any: T;
  status: number;
  message: string;
}

export class YoutubeService {
  private config: Required<youtubeServiceConfig>;

  constructor(config: youtubeServiceConfig = {}) {
    this.config = {
      baseUrl: config.baseUrl || '/api',
      timeout: config.timeout || 5000
    };
  }

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<ServiceResponse<T>> {
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

      const data = await response.json();
      
      return {
        data: any,
        status: response.status,
        message: 'Success'
      };
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async get<T>(endpoint: string): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, { method: 'GET' });
  }

  async post<T>(endpoint: string, data: any): Promise<ServiceResponse<T>> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: JSON.stringify(data: any)
    });
  }
}

export const youtubeService = new YoutubeService();
export default youtubeService;