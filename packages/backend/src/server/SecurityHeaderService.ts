import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import pug from 'pug';
import { JSDOM } from 'jsdom';
import { DI } from '@/di-symbols.js';
import type { Config } from '@/config.js';
import { bindThis } from '@/decorators.js';
import frontendPackageInfo from '../../../frontend/package.json' with { type: 'json' };
import type { FastifyInstance } from 'fastify';

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

@Injectable()
export class SecurityHeaderService {
	private readonly isProduction: boolean;
	private readonly cspEnabled: boolean;
	private readonly reportEnabled: boolean;
	private readonly reportTo: string | undefined;
	private readonly strictestPolicy: string;
	private readonly selfHostedMediaPolicy: string;
	private readonly basePolicy: string;
	private readonly clisPolicy: string;

	constructor(
		@Inject(DI.config)
		private config: Config,
	) {
		this.isProduction = process.env.NODE_ENV !== 'development';
		this.cspEnabled = this.config.contentSecurityPolicy !== undefined && this.isProduction;
		this.reportEnabled = this.cspEnabled && this.config.contentSecurityPolicy?.reportTo !== undefined;

		if (this.reportEnabled) {
			this.reportTo = JSON.stringify({
				group: 'csp',
				max_age: 31536000,
				endpoints: [
					// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
					{ url: this.config.contentSecurityPolicy!.reportTo },
				],
				include_subdomains: true,
			});
		} else {
			this.reportTo = undefined;
		}

		this.strictestPolicy = `default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`;

		this.selfHostedMediaPolicy = `default-src 'none'; style-src 'unsafe-inline'; img-src 'self'; media-src 'self'; base-uri 'none'; sandbox; form-action 'none'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`;

		//#region base.pug
		const { window: baseWindow } = new JSDOM(pug.compileFile(`${_dirname}/web/views/base.pug`)({
			version: this.config.version,
			config: this.config,
		}));

		const baseScriptHashes = [
			createHash('sha256').update(baseWindow.document.getElementsByTagName('script')[0].textContent as string).digest().toString('base64'),
			createHash('sha256').update(readFileSync(`${_dirname}/web/boot.js`)).digest().toString('base64'),
		];

		baseWindow.close();

		const baseScriptSrc = [
			'\'self\'', '\'wasm-unsafe-eval\'',
			'https://static.cloudflareinsights.com/beacon.min.js',
			`https://esm.sh/shiki@${frontendPackageInfo.dependencies.shiki}/`,
			`https://esm.sh/v135/shiki@${frontendPackageInfo.dependencies.shiki}/es2022/`,
			...(baseScriptHashes.map(hash => `'sha256-${hash}'`)),
		].join(' ');

		const mediaProxyOrigin = new URL(this.config.mediaProxy).origin;

		const imgSrc = [
			'\'self\'', 'data:', 'blob:',
			'https://xn--931a.moe/assets/',
			'https://cdn.jsdelivr.net/gh/jdecked/twemoji@15.1.0/assets/',
			...(this.config.externalMediaProxyEnabled ? [mediaProxyOrigin] : []),
			...(this.config.contentSecurityPolicy?.imgAndMediaSrc ?? []),
		].join(' ');

		const mediaSrc = [
			'\'self\'',
			...(this.config.externalMediaProxyEnabled ? [mediaProxyOrigin] : []),
			...(this.config.contentSecurityPolicy?.imgAndMediaSrc ?? []),
		].join(' ');

		const frameSrc = [
			'https://www.google.com/recaptcha/',
			'https://recaptcha.google.com/recaptcha/',
			'https://hcaptcha.com',
			'https://*.hcaptcha.com',
			'https://challenges.cloudflare.com',
			...(this.config.contentSecurityPolicy?.frameSrc ?? []),
		].join(' ');

		this.basePolicy = `default-src 'self'; script-src ${baseScriptSrc}; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.12.0/dist/tabler-icons.min.css; font-src 'self' https://cdn.jsdelivr.net/npm/@tabler/icons-webfont@3.12.0/dist/fonts/; img-src ${imgSrc}; media-src ${mediaSrc}; connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com https://cloudflareinsights.com/cdn-cgi/rum; frame-src ${frameSrc}; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`;
		//#endregion

		//#region bios.pug, cli.pug, flush.pug
		const { window: flushWindow } = new JSDOM(pug.compileFile(`${_dirname}/web/views/flush.pug`)());

		const clisScriptHashes = [
			createHash('sha256').update(readFileSync(`${_dirname}/web/bios.js`)).digest().toString('base64'),
			createHash('sha256').update(readFileSync(`${_dirname}/web/cli.js`)).digest().toString('base64'),
			createHash('sha256').update(flushWindow.document.getElementsByTagName('script')[0].textContent as string).digest().toString('base64'),
		];

		flushWindow.close();

		const clisScriptSrc = [
			'\'self\'',
			...(clisScriptHashes.map(hash => `'sha256-${hash}'`)),
		].join(' ');

		this.clisPolicy = `default-src 'none'; script-src ${clisScriptSrc}; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`;
		//#endregion
	}

	@bindThis
	public attach(fastify: FastifyInstance) {
		fastify.addHook('onRequest', (request, reply, done) => {
			reply.header('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai');
			reply.header('Cross-Origin-Opener-Policy', 'same-origin');
			if (this.isProduction) {
				reply.header('Cross-Origin-Resource-Policy', 'same-origin');
			}
			reply.header('Origin-Agent-Cluster', '?1');
			reply.header('Referrer-Policy', 'same-origin');
			reply.header('X-Content-Type-Options', 'nosniff');
			reply.header('X-Frame-Options', 'DENY');
			reply.header('X-XSS-Protection', '0');

			if (this.reportEnabled) {
				reply.header('Report-To', this.reportTo);
			}

			const secFetchSite = request.headers['sec-fetch-site'];
			const secFetchMode = request.headers['sec-fetch-mode'];
			const secFetchDest = request.headers['sec-fetch-dest'];

			if (this.isProduction && (secFetchSite === 'same-site' || secFetchSite === 'cross-site')) {
				/* eslint-disable no-empty */
				if (request.method === 'GET' && secFetchMode === 'navigate' && secFetchDest === 'document') {
				} else if (request.method === 'GET' && secFetchMode === 'navigate' && secFetchDest === 'empty') {
				} else if (request.method === 'GET' && request.routeOptions.url === '/_info_card_' && secFetchMode === 'navigate' && secFetchDest === 'iframe') {
				} else if (request.method === 'GET' && request.routeOptions.url === '/favicon.ico' && secFetchDest === 'image') {
				} else {
					reply.header('Content-Security-Policy', this.strictestPolicy);
					reply.header('Cache-Control', 'private');
					reply.code(400).send();
				}
				/* eslint-enable no-empty */
			}

			if (this.cspEnabled) {
				switch (request.routeOptions.url) {
					// OpenApiServerService
					case '/api-doc':
						reply.header('Content-Security-Policy', `default-src 'self'; script-src https://cdn.jsdelivr.net/npm/@scalar/api-reference; style-src 'unsafe-inline'; font-src https://fonts.scalar.com; img-src 'self' data:; object-src 'none'; base-uri 'none'; form-action 'self'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`);
						break;

					// ActivityPubServerService
					case '/inbox':
						reply.header('Content-Security-Policy', this.strictestPolicy);
						break;

					// ServerService
					case '/emoji/:path(.*)':
						reply.header('Content-Security-Policy', this.strictestPolicy);
						break;

					// FileServerService
					case '/files/app-default.jpg':
					case '/files/:key':
					case '/files/:key/*':
					case '/proxy/:url*':
						reply.header('Content-Security-Policy', this.selfHostedMediaPolicy);
						break;

					// ClientServerService
					case '/vite/*':
						reply.header('Content-Security-Policy', this.strictestPolicy);
						break;

					case '/static-assets/*':
					case '/client-assets/*':
					case '/assets/*':
					case '/apple-touch-icon.png':
						reply.header('Content-Security-Policy', this.selfHostedMediaPolicy);
						break;

					case '/fluent-emoji/:path(.*)':
					case '/twemoji/:path(.*)':
					case '/twemoji-badge/:path(.*)':
						reply.header('Content-Security-Policy', this.strictestPolicy);
						break;

					case '/favicon.ico':
						reply.removeHeader('Cross-Origin-Resource-Policy');
						reply.header('Content-Security-Policy', this.selfHostedMediaPolicy);
						break;

					case '/sw.js':
						reply.header('Content-Security-Policy-Report-Only', `default-src 'none'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`);
						break;

					case '/url':
						reply.header('Content-Security-Policy', this.strictestPolicy);
						break;

					case '/_info_card_':
						reply.removeHeader('X-Frame-Options');
						reply.header('Content-Security-Policy', `default-src 'none'; style-src 'unsafe-inline'; img-src ${(this.config.contentSecurityPolicy?.imgAndMediaSrc ?? []).join(' ')}; base-uri 'none'; form-action 'none';${this.reportEnabled ? ' report-to csp;' : ''}`);
						break;

					case '/bios':
					case '/cli':
					case '/flush':
						reply.header('Content-Security-Policy', this.clisPolicy);
						break;

					default:
						if (request.routeOptions.url === undefined) {
							reply.header('Content-Security-Policy', this.strictestPolicy);
						} else if (request.routeOptions.url.startsWith('/api/')) {
							// ApiServerService
							reply.header('Content-Security-Policy', this.strictestPolicy);
						} else if (request.routeOptions.url.startsWith('/oauth/')) {
							// OAuth2ProviderService
							reply.header('Content-Security-Policy-Report-Only', `default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`);
						} else if (request.routeOptions.url === '/queue' || request.routeOptions.url.startsWith('/queue/')) {
							// ClientServerService
							reply.header('Content-Security-Policy', `default-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; object-src 'none'; base-uri 'self'; form-action 'none'; frame-ancestors 'none';${this.reportEnabled ? ' report-to csp;' : ''}`);
						} else {
							reply.header('Content-Security-Policy', this.basePolicy);
						}
						break;
				}
			}

			done();
		});
	}
}
