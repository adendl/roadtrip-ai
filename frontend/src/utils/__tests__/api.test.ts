import { API_CONFIG, buildApiUrl, getApiHeaders, API_ENDPOINTS, initializeApiConfig } from '../api';

describe('API Utils', () => {
  beforeEach(() => {
    // Reset window.RUNTIME_CONFIG
    (window as any).RUNTIME_CONFIG = undefined;
    // Reset API_CONFIG to default values
    API_CONFIG.BASE_URL = 'http://localhost:8080';
    API_CONFIG.ENV = 'development';
  });

  describe('API_CONFIG', () => {
    it('should fallback to localhost when no config is available', () => {
      expect(API_CONFIG.BASE_URL).toBe('http://localhost:8080');
      expect(API_CONFIG.ENV).toBe('development');
    });

    it('should allow runtime configuration updates', () => {
      // Test that we can update the config at runtime
      API_CONFIG.BASE_URL = 'https://runtime-api.example.com';
      API_CONFIG.ENV = 'staging';
      
      expect(API_CONFIG.BASE_URL).toBe('https://runtime-api.example.com');
      expect(API_CONFIG.ENV).toBe('staging');
    });
  });

  describe('initializeApiConfig', () => {
    it('should initialize config with Vite env variables', () => {
      (window as any).__VITE_ENV__ = {
        VITE_API_BASE_URL: 'https://vite-api.example.com',
        VITE_APP_ENV: 'production'
      };

      initializeApiConfig();
      expect(API_CONFIG.BASE_URL).toBe('https://vite-api.example.com');
      expect(API_CONFIG.ENV).toBe('production');
    });

    it('should handle missing Vite env gracefully', () => {
      delete (window as any).__VITE_ENV__;
      const originalBaseUrl = API_CONFIG.BASE_URL;
      const originalEnv = API_CONFIG.ENV;

      initializeApiConfig();
      expect(API_CONFIG.BASE_URL).toBe(originalBaseUrl);
      expect(API_CONFIG.ENV).toBe(originalEnv);
    });
  });

  describe('buildApiUrl', () => {
    it('should build correct API URL with endpoint', () => {
      API_CONFIG.BASE_URL = 'https://api.example.com';

      const url = buildApiUrl('users/login');
      expect(url).toBe('https://api.example.com/users/login');
    });

    it('should handle endpoints with leading slash', () => {
      API_CONFIG.BASE_URL = 'https://api.example.com';

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