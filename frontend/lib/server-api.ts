/**
 * Server-side API configuration
 *
 * This file provides the correct API URL for server-side rendering (SSR).
 * In production, it uses the external API URL since the Next.js server
 * cannot access localhost:3001.
 */

// Production API URL - hardcoded because env vars may not be available at runtime
const PRODUCTION_API_URL = "https://studio.odois.com.br";
const DEVELOPMENT_API_URL = "http://localhost:3001";

/**
 * Get the API URL for server-side requests
 *
 * Priority:
 * 1. INTERNAL_API_URL (for internal network communication)
 * 2. NEXT_PUBLIC_API_URL (public API URL)
 * 3. Production URL if NODE_ENV is production
 * 4. Development URL as fallback
 */
export function getServerApiUrl(): string {
  // First try environment variables
  if (process.env.INTERNAL_API_URL) {
    return process.env.INTERNAL_API_URL;
  }

  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL;
  }

  // Detect production environment
  const isProduction = process.env.NODE_ENV === "production";

  return isProduction ? PRODUCTION_API_URL : DEVELOPMENT_API_URL;
}

/**
 * Make a server-side API request with proper error handling
 */
export async function serverFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T | null> {
  const apiUrl = getServerApiUrl();
  const url = `${apiUrl}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
    });

    if (!response.ok) {
      console.error(`Server fetch failed: ${response.status} ${response.statusText} for ${url}`);
      return null;
    }

    return response.json();
  } catch (error) {
    console.error(`Server fetch error for ${url}:`, error);
    return null;
  }
}
