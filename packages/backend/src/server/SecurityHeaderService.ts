import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { readFileSync } from 'node:fs';
import { createHash } from 'node:crypto';
import { Inject, Injectable } from '@nestjs/common';
import { DI } from '@/di-symbols.js';
import type { Config } from '@/config.js';
import { bindThis } from '@/decorators.js';
import type { FastifyInstance } from 'fastify';

const strictestPolicy = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce"; // eslint-disable-line quotes
const inlineStyleLaxedPolicy = "default-src 'none'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce"; // eslint-disable-line quotes

const _filename = fileURLToPath(import.meta.url);
const _dirname = dirname(_filename);

@Injectable()
export class SecurityHeaderService {
	private imgSrc: string;
	private mediaSrc: string;
	private frameSrc: string;
	private reportTo: string;
	private basePolicy: string;
	private biosPolicy: string;
	private cliPolicy: string;

	constructor(
		@Inject(DI.config)
		private config: Config,
	) {
		const mediaProxyOrigin = new URL(this.config.mediaProxy).origin;

		this.imgSrc = ['\'self\'', 'data:', 'https://xn--931a.moe', 'https://misskey-hub.net', 'https://avatars.githubusercontent.com', 'https://assets.misskey-hub.net', ...(this.config.externalMediaProxyEnabled ? [mediaProxyOrigin] : []), ...(this.config.contentSecurityPolicy?.imgAndMediaSrc ?? [])].join(' ');

		this.mediaSrc = ['\'self\'', ...(this.config.externalMediaProxyEnabled ? [mediaProxyOrigin] : []), ...(this.config.contentSecurityPolicy?.imgAndMediaSrc ?? [])].join(' ');

		this.frameSrc = ['https://www.google.com/recaptcha/', 'https://recaptcha.google.com/recaptcha/', 'https://hcaptcha.com', 'https://*.hcaptcha.com', 'https://challenges.cloudflare.com', ...(this.config.contentSecurityPolicy?.frameSrc ?? [])].join(' '),

		this.reportTo = `{"group":"csp-enforce","max_age":31536000,"endpoints":[{"url":"${this.config.contentSecurityPolicy?.reportTo.enforce ?? ''}"}],"include_subdomains":true},{"group":"csp-reportonly","max_age":31536000,"endpoints":[{"url":"${(this.config.contentSecurityPolicy?.reportTo.reportOnly ?? this.config.contentSecurityPolicy?.reportTo.enforce) ?? ''}"}],"include_subdomains":true}`;

		const baseHashes = [
			createHash('sha256').update(`var VERSION = "${this.config.version}";\nvar CLIENT_ENTRY = "${(this.config.clientEntry as any).file}";\n`).digest().toString('base64'),
			createHash('sha256').update(readFileSync(`${_dirname}/web/boot.js`)).digest().toString('base64'),
		];

		this.basePolicy = `default-src 'self'; object-src 'none'; script-src 'self' 'sha256-${baseHashes[0]}' 'sha256-${baseHashes[1]}' https://www.google.com/recaptcha/ https://www.gstatic.com/recaptcha/ https://hcaptcha.com https://*.hcaptcha.com https://challenges.cloudflare.com 'wasm-unsafe-eval'; style-src 'self' 'unsafe-inline' https://hcaptcha.com https://*.hcaptcha.com; img-src ${this.imgSrc}; media-src ${this.mediaSrc}; connect-src 'self' https://hcaptcha.com https://*.hcaptcha.com; frame-src ${this.frameSrc}; base-uri 'none'; form-action 'self'; frame-ancestors 'none'; report-to csp-enforce`;

		const biosHashes = [
			createHash('sha256').update(readFileSync(`${_dirname}/web/bios.js`)).digest().toString('base64'),
		];

		this.biosPolicy = `default-src 'none'; script-src 'sha256-${biosHashes[0]}'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce`;

		const cliHashes = [
			createHash('sha256').update(readFileSync(`${_dirname}/web/cli.js`)).digest().toString('base64'),
		];

		this.cliPolicy = `default-src 'none'; script-src 'sha256-${cliHashes[0]}'; style-src 'unsafe-inline'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce`;
	}

	@bindThis
	public attach(fastify: FastifyInstance) {
		fastify.addHook('onRequest', (request, reply, done) => {
			reply.header('X-Robots-Tag', 'noindex, nofollow, noarchive, nosnippet, noimageindex, noai, noimageai');
			reply.header('Report-To', this.reportTo);
			reply.header('Cross-Origin-Opener-Policy', 'same-origin');
			reply.header('Cross-Origin-Resource-Policy', 'same-origin');
			reply.header('Origin-Agent-Cluster', '?1');
			reply.header('Referrer-Policy', 'same-origin');
			reply.header('X-Content-Type-Options', 'nosniff');
			reply.header('X-Frame-Options', 'DENY');
			reply.header('X-XSS-Protection', '1; mode=block');

			const secFetchSite = request.headers['sec-fetch-site'];
			const secFetchMode = request.headers['sec-fetch-mode'];
			const secFetchDest = request.headers['sec-fetch-dest'];
			if (secFetchSite === 'same-site' || secFetchSite === 'cross-site') {
				/* eslint-disable no-empty */
				if (secFetchMode === 'navigate' && secFetchDest === 'document') {
				} else if (secFetchMode === 'navigate' && secFetchDest === 'empty') {
				} else if (request.routeOptions.url === '/_info_card_' && secFetchMode === 'navigate' && secFetchDest === 'iframe') {
				} else if (request.routeOptions.url === '/favicon.ico' && secFetchDest === 'image') {
				} else {
					reply.header('Content-Security-Policy', strictestPolicy);
					reply.header('Cache-Control', 'private');
					reply.code(400).send();
				}
				/* eslint-enable no-empty */
			}

			if (this.config.contentSecurityPolicy !== undefined) {
				let policy: string;
				let enforce = true;

				switch (request.routeOptions.url) {
					// No registered routes
					case undefined:
						policy = strictestPolicy;
						break;

					// OpenApiServerService
					case '/api-doc':
						policy = "default-src 'self'; object-src 'none'; script-src https://cdn.redoc.ly; style-src 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: https://cdn.redoc.ly; worker-src blob:; base-uri 'self'; form-action 'self'; frame-ancestors 'none'; report-to csp-enforce"; // eslint-disable-line quotes
						break;
					case '/api.json':
						policy = strictestPolicy;
						break;

					// FileServerService
					case '/files/app-default.jpg':
					case '/files/:key':
					case '/files/:key/*':
					case '/proxy/:url*':
						policy = "default-src 'none'; img-src 'self'; media-src 'self'; style-src 'unsafe-inline'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; sandbox; report-to csp-enforce"; // eslint-disable-line quotes
						break;

					// ActivityPubServerService
					case '/inbox':
					case 'notes/:note/activity':
					case '/users/:user/outbox':
					case '/users/:user/followers':
					case '/users/:user/following':
					case '/users/:user/collections/featured':
					case '/users/:user/publickey':
					case '/emojis/:emoji':
					case '/likes/:like':
					case '/follows/:follower/:followee':
					case '/follows/:followRequestId':
						policy = strictestPolicy;
						break;

					// NodeinfoServerService
					case '/nodeinfo/2.1':
					case '/nodeinfo/2.0':
						policy = strictestPolicy;
						break;

					// WellKnownServerService
					case '/.well-known/*':
					case '/.well-known/host-meta':
					case '/.well-known/host-meta.json':
					case '/.well-known/nodeinfo':
					case '/.well-known/oauth-authorization-server':
					case '/.well-known/webfinger':
						policy = strictestPolicy;
						break;

					// ServerService
					case '/emoji/:path(.*)':
					case '/avatar/@:acct':
					case '/identicon/:x':
					case '/verify-email/:code':
						policy = strictestPolicy;
						break;

					// ClientServerService
					case '/vite/*':
						policy = strictestPolicy;
						break;
					case '/static-assets/*':
						policy = inlineStyleLaxedPolicy;
						break;
					case '/client-assets/*':
						policy = "default-src 'none'; style-src 'unsafe-inline'; media-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce"; // eslint-disable-line quotes
						break;
					case '/assets/*':
						policy = strictestPolicy;
						break;
					case '/tarball/*':
						policy = strictestPolicy;
						break;
					case '/favicon.ico':
						policy = inlineStyleLaxedPolicy;
						reply.removeHeader('Cross-Origin-Resource-Policy');
						break;
					case '/apple-touch-icon.png':
					case '/fluent-emoji/:path(.*)':
					case '/twemoji/:path(.*)':
					case 'twemoji-badge/:path(.*)':
						policy = inlineStyleLaxedPolicy;
						break;
					case '/sw.js':
						policy = "default-src 'none'; connect-src 'self'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-reportonly"; // eslint-disable-line quotes
						enforce = false;
						break;
					case '/manifest.json':
					case '/robots.txt':
					case '/opensearch.xml':
					case '/url':
					case '/@:user.atom':
					case '/@:user.rss':
					case '/@:user.json':
						policy = strictestPolicy;
						break;
					case '/_info_card_':
						policy = `default-src 'none'; style-src 'unsafe-inline'; img-src ${this.imgSrc}; base-uri 'none'; form-action 'none'; report-to csp-enforce`;
						break;
					case '/bios':
						policy = this.biosPolicy;
						break;
					case '/cli':
						policy = this.cliPolicy;
						break;
					case '/flush':
						policy = "default-src 'none'; script-src 'sha256-q8KD3Hi5Ef5r5b+pW1/LB/ZQAZOBRI2MHx55DbTE5gs='; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce"; // eslint-disable-line quotes
						break;
					case '/streaming':
						policy = strictestPolicy;
						break;

					default:
						if (request.routeOptions.url.startsWith('/api/')) {
							// ApiServerService
							policy = strictestPolicy;
						} else if (request.routeOptions.url.startsWith('/oauth/')) {
							// OAuth2ProviderService
							policy = "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'; report-to csp-reportonly"; // eslint-disable-line quotes
							enforce = false;
						} else if (request.routeOptions.url === '/queue' || request.routeOptions.url.startsWith('/queue/')) {
							// ClientServerService
							policy = "default-src 'self'; object-src 'none'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; base-uri 'self'; form-action 'none'; frame-ancestors 'none'; report-to csp-enforce"; // eslint-disable-line quotes
						} else {
							policy = this.basePolicy;
						}
						break;
				}

				reply.header(enforce ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only', policy);
			}

			done();
		});
	}
}
