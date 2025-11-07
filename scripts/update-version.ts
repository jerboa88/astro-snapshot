/**
 * Updates version in deno.json
 * Usage: deno run -A scripts/update-version.ts <version>
 */

const version = Deno.args[0];

if (!version) {
	console.error('❌ Version argument is required');
	console.error('Usage: deno run -A scripts/update-version.ts <version>');
	Deno.exit(1);
}

// Validate version format (basic semver check)
if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?(\+[a-zA-Z0-9.-]+)?$/.test(version)) {
	console.error(`❌ Invalid version format: ${version}`);
	console.error('Expected format: X.Y.Z (e.g., 1.0.0, 1.0.0-beta.1)');
	Deno.exit(1);
}

console.log(`📝 Updating version to ${version}...`);

// Update deno.json
try {
	const denoConfigPath = 'deno.json';
	const denoConfig = JSON.parse(await Deno.readTextFile(denoConfigPath));
	denoConfig.version = version;
	await Deno.writeTextFile(
		denoConfigPath,
		JSON.stringify(denoConfig, null, 2) + '\n',
	);
	console.log(`✅ Updated ${denoConfigPath}`);
} catch (error) {
	console.error(`❌ Failed to update deno.json: ${error.message}`);
	Deno.exit(1);
}

console.log(`🎉 Version updated to ${version} successfully!`);
