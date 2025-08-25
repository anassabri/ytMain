// playlistService - Enhanced Service
export class PlaylistService {
  private apiUrl: string;

  constructor(apiUrl = '/api') {
    this.apiUrl = apiUrl;
  }

  async get<T>(endpoint: string): Promise<T> {
    try {
      const response = await fetch(this.apiUrl + endpoint);
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return await response.json();
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }

  async post<T>(endpoint: string, data: any): Promise<T> {
    try {
      const response = await fetch(this.apiUrl + endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data: any)
      });
      if (!response.ok) {
        throw new Error('HTTP ' + response.status);
      }
      return await response.json();
    } catch (error) {
      console.error('Service error:', error);
      throw error;
    }
  }
}

export const playlistService = new PlaylistService();
export default playlistService;