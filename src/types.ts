import type { AstroIntegration } from 'astro';
import type { GoToOptions, ScreenshotOptions } from 'puppeteer';
import puppeteer from 'puppeteer';

/**
 * Supported image output formats for screenshots.
 * Derived from Puppeteer's {@link ScreenshotOptions.type}.
 */
export type Format = Exclude<ScreenshotOptions['type'], undefined>;

/**
 * Type alias for the Astro `astro:config:done` hook handler.
 * Triggered after the Astro configuration is finalized.
 */
export type HandleConfigDone = AstroIntegration['hooks']['astro:config:done'];

/**
 * Type alias for the Astro `astro:build:done` hook handler.
 * Triggered after the build process completes.
 */
export type HandleBuildDone = AstroIntegration['hooks']['astro:build:done'];

/**
 * Configuration for a single page screenshot.
 */
export interface ScreenshotConfig {
	/**
	 * Custom output path for the screenshot.
	 * Can be absolute or relative to the project root.
	 * @default "public/screenshots/[page-path].png"
	 */
	outputPath: `${string}.${Format}`;

	/**
	 * Width of the screenshot viewport in pixels.
	 * @default 1200 (OpenGraph standard width)
	 */
	width?: number;

	/**
	 * Height of the screenshot viewport in pixels.
	 * @default 630 (OpenGraph standard height)
	 */
	height?: number;

	/**
	 * Options to pass to Puppeteer's `page.goto()` method.
	 * Controls how navigation and page loading are handled.
	 * @see https://pptr.dev/api/puppeteer.waitforoptions
	 */
	gotoOptions?: GoToOptions;

	/**
	 * Options to pass to Puppeteer's `page.screenshot()` method.
	 * Note: `path` will be overridden by the integration.
	 * Note: `format` will be inferred from the output path.
	 * @see https://pptr.dev/api/puppeteer.screenshotoptions
	 */
	screenshotOptions?: Omit<ScreenshotOptions, 'path' | 'format'>;
}

/**
 * Global configuration for the snapshot integration.
 * Defines which pages to capture, default behavior,
 * and Puppeteer launch settings.
 */
export interface SnapshotIntegrationConfig {
	/**
	 * Map of page paths to their screenshot configurations.
	 * Each key represents a route (e.g., "/", "/about", "/blog/post-1").
	 */
	pages: Record<string, ScreenshotConfig[]>;

	/**
	 * Default configuration applied to all pages.
	 * Can be overridden per page in `pages`.
	 */
	defaults?: Omit<ScreenshotConfig, 'skip' | 'outputPath'>;

	/**
	 * Puppeteer launch options.
	 * @see https://pptr.dev/api/puppeteer.launchoptions
	 */
	launchOptions?: Parameters<typeof puppeteer.launch>[0];

	/**
	 * Port for the local server during build.
	 * Used to render pages before screenshot generation.
	 * @default 4322
	 */
	port?: number;
}
