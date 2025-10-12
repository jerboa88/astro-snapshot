<!-- Project Header -->
<div align="center">
<h1 class="projectName">📸 Astro Snapshot</h1>
<p class="projectBadges">
  <img src="https://johng.io/badges/category/Plugin.svg" alt="Project category" title="Project category">
  <img src="https://img.shields.io/github/languages/top/jerboa88/astro-snapshot.svg" alt="Language" title="Language">
  <a href="https://www.npmjs.com/package/astro-snapshot"><img src="https://img.shields.io/npm/v/astro-snapshot" alt="View package on npmjs" title="View package on npmjs"/></a>
  <img src="https://img.shields.io/github/repo-size/jerboa88/astro-snapshot.svg" alt="Repository size" title="Repository size">
  <a href="LICENSE"><img src="https://img.shields.io/github/license/jerboa88/astro-snapshot.svg" alt="Project license" title="Project license"/></a>
</p>
<p class="projectDesc">
  An Astro integration for generating screenshots of your pages automatically at build time
</p>
<br/>
</div>

> [!WARNING]
> This is currently an experimental project or proof-of-concept. It may contain bugs or incomplete features, and is not intended for production use. Breaking changes may be made at any time. Consider more stable alternatives for critical applications.

## 👋 About

Generate screenshots of your [Astro] pages automatically at build time with **Astro Snapshot**. Perfect for creating social media images, content previews, and dynamic icons.

This integration was inspired by a similar plugin I wrote for [Gatsby] called [Gatsby Plugin: Component to Image] and [astro-selfie]. Compared to astro-selfie, this integration exposes a lot more configuration options that allow you to completely customize how images are generated.

### Features

- **🚀 Works with any page** : Generate one or more images from any valid Astro page
  - Not limited by presets or available integration options like other solutions
  - Not limited by types of JSX elements or CSS properties supported by [Satori]
  - Use whatever front-end framework you want
- **📷 Configurable output filetypes**: Generate PNG, JPEG, or WebP images with arbitrary dimensions
  - Formats are automatically detected from the file extension
  - Pass though options to [Puppeteer] for precise control of image quality, encoding speed, and more
- **📂 Customizable output paths**: Full control over paths of the generated images
  - Save images to the `public` directory to include them in the build, unprocessed
  - Save images to the `dist` directory if you don't want to include theme in source control
  - Save them in the `src` dir for further compression or importing into components*
  - Or save them somewhere else, your choice
- **🎛️ Default options**: Reuse the same options for multiple images
  - Provide defaults for all options and override them on a per-image basis
- 🔧 **TypeScript support**: Full type safety for all options and functions
  - No need to worry about typos or incorrect config values

### Use cases

- **🏞️ Social images**: Use your existing front-end components to generate Open Graph images and/or Twitter cards for your blog posts or other content
- **Content previews**: Generate screenshots of your website for use in documentation, marketing materials
- **🖼️ Favicons**: Dynamically generate favicons for your website

### How it works

> [!IMPORTANT]
> Note that, because this plugin runs _**after**_ the build completes, you will not be able to import the generated images into your components or perform any further operations with them in the same build cycle.
>
> You can, however, use them in the next build, provided they are not overwritten. If you do this, make sure to account for the images not existing the first time you perform a build (i.e. use a placeholder image or catch errors from `import` statements).

After the Astro build completes, this plugin uses [Puppeteer] to render the pages in a headless browser and save screenshots of the rendered content as images

## 📦 Installation

> [!TIP]
> If you see any warnings like `Cannot find package 'puppeteer'` after adding the integration, your package manager may not have installed peer dependencies for you. To install these missing packages, run the following command:
>
> ```bash
> npm install puppeteer
> ```
>
> ```bash
> pnpm add puppeteer
> ```
>
> ```bash
> yarn add puppeteer
> ```
>
> ```bash
> bun add puppeteer
> ```

### Automatic

We can use the Astro CLI to install the integration automatically:
```bash
npx astro add astro-snapshot
```
```bash
pnpm astro add astro-snapshot
```
```bash
yarn astro add astro-snapshot
```
```bash
bunx astro add astro-snapshot
```

If you run into any issues, try the manual installation steps below.

### Manual

First, install the `astro-snapshot` package using your package manager.

```bash
npm install astro-snapshot
```
```bash
pnpm add astro-snapshot
```
```bash
yarn add astro-snapshot
```
```bash
bun add astro-snapshot
```

Then, apply the integration to your `astro.config.*` file using the integrations property:

```diff
// astro.config.mjs
import { defineConfig } from 'astro/config';
+import snapshot from 'astro-snapshot';

export default defineConfig({
  // ...
-  integrations: [],
+  integrations: [snapshot()],
});
```

## 🕹️ Usage

### Configure the Integration

Add the integration to your `astro.config.mjs` or `astro.config.ts` file and configure it like so:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import snapshot from 'astro-snapshot';

export default defineConfig({
  integrations: [
    snapshot({
      pages: {
        // Single screenshot for homepage
        '/': [
          {
            outputPath: 'public/og/home.png'
          }
        ],
        // Multiple screenshots for about page (different sizes)
        '/about': [
          {
            outputPath: 'public/og/about-og.png',
            width: 1200,
            height: 630
          },
          {
            outputPath: 'public/og/about-square.jpg',
            width: 1080,
            height: 1080
          },
          {
            outputPath: 'public/og/about-twitter.png',
            width: 1200,
            height: 675
          }
        ]
      }
    })
  ]
});
```

## 🤖 Advanced Usage

### Full Configuration Example

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import snapshot from 'astro-snapshot';

export default defineConfig({
  integrations: [
    snapshot({
      // Pages to screenshot (required)
      pages: {
        '/': [
          {
            outputPath: 'public/og/home.png',
            width: 1200,              // Viewport width (default: 1200)
            height: 630,              // Viewport height (default: 630)

            // Puppeteer page.goto() options
            gotoOptions: {
              waitUntil: 'networkidle0',
              timeout: 30000
            },

            // Puppeteer page.screenshot() options
            screenshotOptions: {
              quality: 95,            // For jpeg only
              fullPage: false,
              clip: {                 // Capture specific region
                x: 0,
                y: 0,
                width: 1200,
                height: 630
              }
            }
          }
        ]
      },

      // Default config for all screenshots (optional)
      defaults: {
        width: 1200,
        height: 630,
        gotoOptions: {
          waitUntil: 'networkidle2'
        }
      },

      // Port for preview server (default: 4322)
      port: 4322,

      // Puppeteer launch options
      launchOptions: {
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      }
    })
  ]
});
```

### Multiple Formats for Social Media

> [!TIP]
> If you need to reference output paths in your pages, define the config in a common place and import it into your pages as needed. The integration doesn't provide any methods for getting the output paths, so you'll need to manage that yourself.

Generate optimized images for different platforms:

```js
// astro.config.mjs
const socialMediaSizes = {
  og: { width: 1200, height: 630 },         // OpenGraph
  twitter: { width: 1200, height: 600 },    // Twitter
  linkedin: { width: 1200, height: 627 },   // LinkedIn
  instagram: { width: 1080, height: 1080 }  // Instagram
};

export default defineConfig({
  integrations: [
    snapshot({
      pages: {
        '/': Object.entries(socialMediaSizes).map(([platform, dims]) => ({
          outputPath: `public/social/${platform}.png`,
          ...dims
        }))
      }
    })
  ]
});
```

### Dynamic Blog Post Screenshots

Generate screenshots for all blog posts:

```js
// astro.config.mjs
import { defineConfig } from 'astro/config';
import snapshot from 'astro-snapshot';

// Get all blog post slugs (implement based on your setup)
const blogPosts = await getBlogPostSlugs();

// Create config for each blog post
const blogPages = Object.fromEntries(
  blogPosts.map(slug => [
    `/blog/${slug}`,
    [
      {
        outputPath: `public/og/blog/${slug}.png`,
        width: 1200,
        height: 630
      },
      {
        outputPath: `public/og/blog/${slug}-square.jpg`,
        width: 1080,
        height: 1080
      }
    ]
  ])
);

export default defineConfig({
  integrations: [
    snapshot({
      pages: {
        '/': [{ outputPath: 'public/og/home.png' }],
        '/about': [{ outputPath: 'public/og/about.png' }],
        ...blogPages
      }
    })
  ]
});
```

### Conditional Screenshot Generation

> [!TIP]
> Optimize build performance by conditionally generating screenshots based on environment variables or build mode.

Control when screenshots are generated:

```js
// astro.config.mjs
const isDevelopment = process.env.NODE_ENV === 'development';
const shouldGenerateScreenshots = process.env.GENERATE_SCREENSHOTS === 'true';

export default defineConfig({
  integrations: [
    // Only add integration when needed
    ...(shouldGenerateScreenshots || !isDevelopment ? [
      snapshot({
        pages: {
          '/': [{ outputPath: 'public/og/home.png' }]
        }
      })
    ] : [])
  ]
});
```

### Custom Viewport Configurations

Different viewports for different purposes:

```js
// astro.config.mjs
const viewports = {
  desktop: { width: 1920, height: 1080 },
  tablet: { width: 768, height: 1024 },
  mobile: { width: 375, height: 667 }
};

export default defineConfig({
  integrations: [
    snapshot({
      pages: {
        '/': Object.entries(viewports).map(([device, dims]) => ({
          outputPath: `public/previews/${device}.png`,
          ...dims
        }))
      }
    })
  ]
});
```

### Waiting for Dynamic Content

Handle pages with animations or lazy-loaded content:

```js
// astro.config.mjs
export default defineConfig({
  integrations: [
    snapshot({
      pages: {
        '/dashboard': [
          {
            outputPath: 'public/og/dashboard.png',
            gotoOptions: {
              waitUntil: 'networkidle0',  // Wait for all network requests
              timeout: 60000               // Increase timeout
            }
          }
        ]
      }
    })
  ]
});
```

## 📚 API Reference

### `SnapshotIntegrationConfig`

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `pages` | `Record<string, ScreenshotConfig[]>` | ✅ | - | Map of page paths to screenshot configs |
| `defaults` | `Partial<ScreenshotConfig>` | ❌ | `{}` | Default config for all screenshots |
| `launchOptions` | `PuppeteerLaunchOptions` | ❌ | `{ headless: true }` | Puppeteer launch options |
| `port` | `number` | ❌ | `4322` | Preview server port |

### `ScreenshotConfig`

| Property | Type | Required | Default | Description |
|----------|------|----------|---------|-------------|
| `outputPath` | `string` | ✅ | - | Output path with format extension |
| `width` | `number` | ❌ | `1200` | Viewport width in pixels |
| `height` | `number` | ❌ | `630` | Viewport height in pixels |
| `gotoOptions` | `GoToOptions` | ❌ | `{ waitUntil: 'networkidle2' }` | Puppeteer goto options |
| `screenshotOptions` | `ScreenshotOptions` | ❌ | `{}` | Puppeteer screenshot options |

### Supported Formats

The format is automatically detected from the file extension in `outputPath`:

- `.png` - PNG format
- `.jpg` / `.jpeg` - JPEG format
- `.webp` - WebP format

## ❓ FAQ

### Screenshots not generating

1. Check that pages are correctly specified in config
2. Ensure Puppeteer dependencies are installed
3. Verify the build completes without errors
4. Check console output for screenshot generation logs

### Permission errors

On some systems, Puppeteer may need additional configuration:

```js
launchOptions: {
  args: ['--no-sandbox', '--disable-setuid-sandbox']
}
```

### Memory issues with many screenshots

Process pages in batches or increase Node memory:

```bash
NODE_OPTIONS="--max-old-space-size=4096" npm run build
```

### Docker deployment

Add these args for containerized environments:

```js
launchOptions: {
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--disable-dev-shm-usage',
    '--disable-gpu'
  ]
}
```

## 🤝 Contributing

Contributions, issues, and forks are welcome. See [CONTRIBUTING.md](CONTRIBUTING.md) for more details.

## 🧾 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) for details.

We are not affiliated with or endorsed by Astro.

## 🖇️ Related

- **[Gatsby Plugin: Component to Image]**: A sister image generation plugin for the Gatsby framework.
- **[astro-selfie]**: A similar integration that automatically generates images for every page.

## 💕 Funding

Find this project useful? [Sponsoring me](https://johng.io/funding) will help me cover costs and **_commit_** more time to open-source.

If you can't donate but still want to contribute, don't worry. There are many other ways to help out, like:

- 📢 reporting (submitting feature requests & bug reports)
- 👨‍💻 coding (implementing features & fixing bugs)
- 📝 writing (documenting & translating)
- 💬 spreading the word
- ⭐ starring the project

I appreciate the support!

[Astro]: https://astro.build/
[Gatsby]: https://www.gatsbyjs.com/
[astro-selfie]: https://github.com/vadimdemedes/astro-selfie
[Open Graph]: https://ogp.me/
[Typescript]: https://www.typescriptlang.org/
[Satori]: https://github.com/vercel/satori
[Puppeteer]: https://pptr.dev/
[Gatsby Plugin: Component to Image]: https://github.com/jerboa88/gatsby-plugin-component-to-image
