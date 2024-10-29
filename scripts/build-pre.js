/*
 * SPDX-FileCopyrightText: syuilo and misskey-project
 * SPDX-License-Identifier: AGPL-3.0-only
 */

const fs = require('fs');
const packageJsonPath = __dirname + '/../package.json';
const frontendPackageJsonPath = __dirname + '/../packages/frontend/package.json';

function build() {
	try {
		const json = fs.readFileSync(packageJsonPath, 'utf-8');
		const meta = JSON.parse(json);
		const frontendJson = fs.readFileSync(frontendPackageJsonPath, 'utf-8');
		const frontendMeta = JSON.parse(frontendJson);
		fs.mkdirSync(__dirname + '/../built', { recursive: true });
		fs.writeFileSync(__dirname + '/../built/meta.json', JSON.stringify({ version: meta.version, shikiVersion: frontendMeta.devDependencies.shiki }), 'utf-8');
	} catch (e) {
		console.error(e)
	}
}

build();

if (process.argv.includes("--watch")) {
	fs.watch(packageJsonPath, (event, filename) => {
		console.log(`update ${filename} ...`)
		build()
	})
}
