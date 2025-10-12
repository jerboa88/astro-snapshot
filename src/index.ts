import { preview, type AstroConfig, type AstroIntegration } from 'astro';
import { launch } from 'puppeteer';
import { fileURLToPath } from 'node:url';
import { mkdir } from 'node:fs/promises';
import { dirname, resolve, relative } from 'node:path';
import type {
	HandleBuildDone,
	HandleConfigDone,
	ScreenshotConfig,
	SnapshotIntegrationConfig,
} from './types.js';
import { getFormat } from './utils.js';

/**
 * Creates the Astro Screenshot integration
 *
 * @param config - Configuration for the screenshot integration
 * @returns Astro integration object
 *
 * @example
 * ```ts
 * // astro.config.mjs
 * import { defineConfig } from 'astro/config';
 * import snapshot from 'astro-snapshot';
 *
 * export default defineConfig({
 *   integrations: [
 *     snapshot({
 *       pages: {
 *         '/': true,
 *         '/about': {
 *           width: 1920,
 *           height: 1080,
 *           outputPath: 'public/images/about-preview.png'
 *         }
 *       }
 *     })
 *   ]
 * });
 * ```
 */
export default function snapshot(
	config: SnapshotIntegrationConfig,
): AstroIntegration {
	// Resolved config options
	const pages = config.pages;
	const defaults = {
		...config.defaults,
	} as const;
	const launchOptions = {
		headless: true,
		...config.launchOptions,
	} as const;
	const port = config.port ?? 4322;

	let astroConfig: AstroConfig;
	let rootDir: string;

	/**
	 * Merges per-page configuration with defaults and resolves
	 * the final screenshot configuration.
	 *
	 * @param pageConfig - Configuration for a specific page.
	 * @returns Fully resolved configuration for Puppeteer.
	 */
	const resolveScreenshotConfig = (pageConfig: ScreenshotConfig) => {
		const outputPath = pageConfig.outputPath;

		return {
			// Or operator is used to ignore 0
			width: pageConfig.width || defaults.width || 1200,
			height: pageConfig.height || defaults.height || 630,
			goToOptions: {
				waitUntil: 'networkidle2',
				...defaults.gotoOptions,
				...pageConfig.gotoOptions,
			} as const,
			outputPath,
			screenshotOptions: {
				path: outputPath,
				type: getFormat(outputPath),
				fullPage: false,
				...defaults.screenshotOptions,
				...pageConfig.screenshotOptions,
			} as const,
		};
	};

	/**
	 * Handles the `astro:config:done` lifecycle event.
	 * Stores the Astro configuration and root directory for later use.
	 *
	 * @param param0 - Object containing the resolved Astro config.
	 */
	const handleConfigDone: HandleConfigDone = ({ config }) => {
		astroConfig = config;
		rootDir = fileURLToPath(astroConfig.root);
	};

	/**
	 * Handles the `astro:build:done` lifecycle event.
	 * Launches a local preview server and uses Puppeteer to generate
	 * screenshots for all configured pages.
	 *
	 * @param param0 - Object containing the Astro logger instance.
	 */
	const handleBuildDone: HandleBuildDone = async ({ logger }) => {
		const pageEntries = Object.entries(pages);

		if (pageEntries.length === 0) {
			logger.debug(
				'No pages configured for screenshot generation. Skipping...',
			);

			return;
		}

		// Start local server to render pages
		const previewServer = await preview({
			root: rootDir,
			server: { port },
		});

		// Launch Puppeteer
		const browser = await launch(launchOptions);

		try {
			for (const [pagePath, screenshotConfigs] of pageEntries) {
				const normalizedPagePath = pagePath.startsWith('/')
					? pagePath
					: `/${pagePath}`;
				const pageUrl =
					`http://localhost:${port}${normalizedPagePath}` as const;

				for (const screenshotConfig of screenshotConfigs) {
					const { width, height, goToOptions, outputPath, screenshotOptions } =
						resolveScreenshotConfig(screenshotConfig);

					const absoluteOutputPath = resolve(rootDir, outputPath);

					// Ensure output directory exists
					await mkdir(dirname(absoluteOutputPath), { recursive: true });

					// Create page and take screenshot
					const page = await browser.newPage();

					await page.setViewport({ width, height });
					await page.goto(pageUrl, goToOptions);
					await page.screenshot(screenshotOptions);
					await page.close();

					// Store the generated screenshot path
					const relativePath = relative(rootDir, absoluteOutputPath);

					logger.info(
						`📸 Screenshot generated: ${normalizedPagePath} → ${relativePath}`,
					);
				}
			}
		} finally {
			await browser.close();
			await previewServer.stop();
		}
	};

	return {
		name: 'astro-snapshot',
		hooks: {
			'astro:config:done': handleConfigDone,
			'astro:build:done': handleBuildDone,
		},
	};
}

/**
 * Type helper for the integration configuration
 */
export type { SnapshotIntegrationConfig as Config };
