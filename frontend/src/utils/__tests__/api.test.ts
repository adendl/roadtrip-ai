import { API_CONFIG, buildApiUrl, getApiHeaders, API_ENDPOINTS } from '../api';

describe('API Utils', () => {
  beforeEach(() => {
    // Reset window.RUNTIME_CONFIG
    (window as any).RUNTIME_CONFIG = undefined;
  });

  describe('API_CONFIG', () => {
    it('should fallback to localhost when no config is available', () => {
      expect(API_CONFIG.BASE_URL).toBe('http://localhost:8080');
      expect(API_CONFIG.ENV).toBe('development');
    });

    it('should use runtime config when available', () => {
      (window as any).RUNTIME_CONFIG = {
        VITE_API_BASE_URL: 'https://runtime-api.example.com',
        VITE_APP_ENV: 'staging'
      };

      expect(API_CONFIG.BASE_URL).toBe('https://runtime-api.example.com');
      expect(API_CONFIG.ENV).toBe('staging');
    });
  });

  describe('buildApiUrl', () => {
    it('should build correct API URL with endpoint', () => {
      (window as any).RUNTIME_CONFIG = {
        VITE_API_BASE_URL: 'https://api.example.com'
      };

      const url = buildApiUrl('users/login');
      expect(url).toBe('https://api.example.com/users/login');
    });

    it('should handle endpoints with leading slash', () => {
      (window as any).RUNTIME_CONFIG = {
        VITE_API_BASE_URL: 'https://api.example.com'
      };

      const url = buildApiUrl('/users/login');
      expect(url).toBe('https://api.example.com/users/login');
    });
  });

  describe('getApiHeaders', () => {
    it('should return basic headers without token', () => {
      const headers = getApiHeaders();
      expect(headers).toEqual({
        'Content-Type': 'application/json'
      });
    });

    it('should include authorization header with token', () => {
      const token = 'test-token-123';
      const headers = getApiHeaders(token);
      expect(headers).toEqual({
        'Content-Type': 'application/json',
        'Authorization': 'Bearer test-token-123'
      });
    });
  });

  describe('API_ENDPOINTS', () => {
    it('should have correct endpoint structure', () => {
      expect(API_ENDPOINTS.LOGIN).toBe('api/users/login');
      expect(API_ENDPOINTS.SIGNUP).toBe('api/users/signup');
      expect(API_ENDPOINTS.TRIPS.CREATE).toBe('api/trips/create');
      expect(API_ENDPOINTS.TRIPS.GET_USER_TRIPS).toBe('api/trips/user');
    });

    it('should generate dynamic endpoints correctly', () => {
      const deleteEndpoint = API_ENDPOINTS.TRIPS.DELETE('123');
      expect(deleteEndpoint).toBe('api/trips/123');
    });
  });
}); 