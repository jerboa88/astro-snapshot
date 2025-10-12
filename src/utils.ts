import type { Format } from './types.js';

/**
 * Extracts and normalizes the image format from a given file path.
 *
 * Determines the file extension following the last period (".") in the path,
 * ensuring it is part of the filename (not a directory). The function
 * normalizes certain extensions (e.g., `"jpg"` → `"jpeg"`) and validates
 * that the format is supported.
 *
 * @param path - The file path to extract the format from.
 * @returns The normalized image format as a {@link Format}.
 *
 * @throws {Error} If no valid file extension is found or the extension is unsupported.
 *
 * @example
 * ```ts
 * getFormat('/images/photo.jpg'); // 'jpeg'
 * getFormat('C:\\assets\\icon.webp'); // 'webp'
 * getFormat('file.png'); // 'png'
 * ```
 */
export function getFormat(path: string): Format {
	const lastDot = path.lastIndexOf('.');
	const lastSlash = Math.max(path.lastIndexOf('/'), path.lastIndexOf('\\'));

	// No dot, or dot is part of a directory (e.g., ".config/file")
	if (lastDot <= lastSlash) {
		throw new Error('No file extension found');
	}

	const extension = path.slice(lastDot + 1);

	if (extension === 'jpg' || extension === 'jpeg') {
		return 'jpeg';
	}

	if (extension === 'png' || extension === 'webp') {
		return extension;
	}

	throw new Error('Unsupported extension');
}
