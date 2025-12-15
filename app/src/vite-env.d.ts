/// <reference types="vite/client" />

import type {
  SeedDataOptions,
  SeedDataResult,
  ClearDataResult,
} from './utils/seedData'

declare global {
  interface Window {
    /**
     * Seed the application with sample data for testing purposes.
     *
     * @param options - Seeding options
     * @param options.force - If true, overwrite existing data. Defaults to false.
     * @returns Summary of seeded data
     *
     * @example
     * // Seed data (will skip if data already exists)
     * await window.seedData()
     *
     * @example
     * // Force seed data (overwrites existing data)
     * await window.seedData({ force: true })
     */
    seedData: (options?: SeedDataOptions) => Promise<SeedDataResult>

    /**
     * Clear all data from localStorage.
     *
     * @returns Summary of cleared data
     *
     * @example
     * // Clear all data
     * await window.clearData()
     */
    clearData: () => Promise<ClearDataResult>
  }
}
