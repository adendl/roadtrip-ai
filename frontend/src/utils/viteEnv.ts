// Vite environment variable access
// Only import this in browser code, never in tests!
export function getViteEnv(key: string, fallback: string): string {
  return import.meta.env[key] || fallback;
} 