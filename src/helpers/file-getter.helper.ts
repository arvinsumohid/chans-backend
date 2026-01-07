import fs from 'fs';
import path from 'path';

export const getAllFiles = (dir: string, files: string[] = []): string[] => {
	const entries = fs.readdirSync(dir, { withFileTypes: true });

	for (const entry of entries) {
		const fullPath = path.join(dir, entry.name);

		if (entry.isDirectory()) {
			getAllFiles(fullPath, files);
		} else if (path.extname(entry.name) === '.js') {
			files.push(fullPath);
		}
	}

	return files;
};
