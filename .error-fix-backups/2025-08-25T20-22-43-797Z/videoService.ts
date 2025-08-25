// videoService - Enhanced Service
export interface VideoServiceConfig {
  apiUrl?: string;
  timeout?: number;
  retries?: number;
}

export class VideoService {
  private config: VideoServiceConfig;

  constructor(config: VideoServiceConfig = {}) {
    this.config = {
      apiUrl: '/api',
      timeout: 5000,
      retries: 3,
      ...config
    };
  }

  async fetchData<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Service fetch error:', error);
      throw error;
    }
  }

  async postData<T>(endpoint: string, data): Promise<T> {
    try {
      const response = await fetch(`${this.config.apiUrl}${endpoint}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error) {
      console.error('Service post error:', error);
      throw error;
    }
  }
}

export const videoService = new VideoService();
export default videoService;