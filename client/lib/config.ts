/**
 * Central runtime configuration.
 * All API base URLs and environment-driven constants live here.
 * Components import from this file — never hardcode URLs inline.
 */

/** FastAPI backend base URL */
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api/v1";
