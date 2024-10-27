import globals from 'globals';
import pluginMisskey from '@misskey-dev/eslint-plugin';

/* eslint-disable import/no-default-export */

export default [
	...pluginMisskey.configs['recommended'],
	{
		files: ['**/*.cjs'],
		languageOptions: {
			parserOptions: {
				sourceType: 'commonjs',
			},
			globals: {
				...globals.node,
				...globals.commonjs,
			},
		},
	},
	{
		files: ['**/*.js', '**/*.jsx'],
		languageOptions: {
			parserOptions: {
				sourceType: 'module',
			},
		},
	},
	{
		files: ['build.js'],
		languageOptions: {
			globals: globals.node,
		},
	},
];
