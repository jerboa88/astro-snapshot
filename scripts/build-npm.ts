import { build, emptyDir } from '@deno/dnt';
import deno from '../deno.json' with { type: 'json' };

const author = {
	username: 'twocaretcat',
	domain: 'johng.io',
} as const;
const packageName = 'astro-snapshot' as const;
const dir = {
	src: './src',
	out: './npm',
} as const;

await emptyDir(dir.out);
await build({
	entryPoints: [
		{
			name: '.',
			path: `${dir.src}/index.ts`,
		},
	],
	outDir: dir.out,
	compilerOptions: {
		lib: ['ES2022', 'DOM'],
		target: 'ES2022',
	},
	shims: {},
	test: false,
	package: {
		name: deno.name,
		version: Deno.args[0] ?? deno.version,
		description: 'Astro integration for generating screenshots of pages using Puppeteer.',
		keywords: [
			'withastro',
			'astro',
			'astro-integration',
			'screenshot',
			'puppeteer',
			'puppeteer-screenshot',
			'social-preview',
			'social-images',
			'og-images',
			'preview',
			'image',
			'images',
			'seo',
			'typescript',
		],
		license: 'MIT',
		author: {
			name: 'John Goodliff',
			url: `https://${author.domain}`,
		},
		repository: {
			type: 'git',
			url: `git+https://github.com/${author.username}/${packageName}.git`,
		},
		homepage: `https://${author.domain}/p/${packageName}`,
		bugs: `https://github.com/${author.username}/${packageName}/issues`,
		funding: [
			{
				type: 'individual',
				url: `https://${author.domain}/funding`,
			},
			{
				type: 'GitHub Sponsors',
				url: `https://github.com/sponsors/${author.username}`,
			},
			{
				type: 'Patreon',
				url: `https://patreon.com/${author.username}`,
			},
			{
				type: 'Brave Creators',
				url: 'https://publishers.basicattentiontoken.org/en/c/johng',
			},
		],
	},
	postBuild() {
		Deno.copyFileSync('LICENSE', `${dir.out}/LICENSE`);
		Deno.copyFileSync('README.md', `${dir.out}/README.md`);
	},
});
