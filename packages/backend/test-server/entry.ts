import { portToPid } from 'pid-port';
import fkill from 'fkill';
import Fastify from 'fastify';
import { NestFactory } from '@nestjs/core';
import { MainModule } from '@/MainModule.js';
import { ServerService } from '@/server/ServerService.js';
import { loadConfig } from '@/config.js';
import { NestLogger } from '@/NestLogger.js';
import { INestApplicationContext } from '@nestjs/common';

const config = loadConfig();
const originEnv = JSON.stringify(process.env);

process.env.NODE_ENV = 'test';

let app: INestApplicationContext;
let serverService: ServerService;

/**
 * テスト用のサーバインスタンスを起動する
 */
async function launch() {
	await killTestServer();

	console.log('starting application...');

	app = await NestFactory.createApplicationContext(MainModule, {
		logger: new NestLogger(),
	});
	serverService = app.get(ServerService);
	await serverService.launch();

	await startControllerEndpoints();

	// ジョブキューは必要な時にテストコード側で起動する
	// ジョブキューが動くとテスト結果の確認に支障が出ることがあるので意図的に動かさないでいる

	console.log('application initialized.');
}

/**
 * 既に重複したポートで待ち受けしているサーバがある場合はkillする
 */
async function killTestServer() {
	try {
		const pid = await portToPid(config.port);
		if (pid) {
			await fkill(pid, { force: true });
		}
	} catch {
		// NOP;
	}

	// kill env update/reset server
	try {
		const pid = await portToPid(config.port + 1000);
		if (pid) {
			await fkill(pid, { force: true });
		}
	} catch {
		// NOP;
	}
}

/**
 * 別プロセスに切り離してしまったが故に出来なくなった環境変数の書き換え等を実現するためのエンドポイントを作る
 * @param port
 */
async function startControllerEndpoints(port = config.port + 1000) {
	const fastify = Fastify();

	fastify.post<{ Body: { key?: string, value?: string } }>('/env', async (req, res) => {
		const key = req.body['key'];
		if (!key) {
			res.code(400).send({ success: false });
			return;
		}

		process.env[key] = req.body['value'];

		res.code(200).send({ success: true });
	});

	fastify.post<{ Body: { key?: string, value?: string } }>('/env-reset', async (req, res) => {
		process.stdout.write('got env reset request (entry.ts:/env-reset)\n');
		process.env = JSON.parse(originEnv);

		await new Promise<void>(resolve => {
			const timerId = setTimeout(() => resolve(), 1000 * 15);
			serverService.dispose().then(() => {
				clearTimeout(timerId);
				resolve();
			});
		});

		// await serverService.dispose();
		process.stdout.write('disposed ServerService (entry.ts:/env-reset)\n');
		await app.close();
		process.stdout.write('Closed Nest app (entry.ts:/env-reset)\n');

		await killTestServer();
		process.stdout.write('killed test server (entry.ts:/env-reset)\n');

		console.log('starting application...');

		app = await NestFactory.createApplicationContext(MainModule, {
			logger: new NestLogger(),
		});
		process.stdout.write('created Nest app (entry.ts:/env-reset)\n');
		serverService = app.get(ServerService);
		await serverService.launch();
		process.stdout.write('launched ServerService (entry.ts:/env-reset)\n');

		res.code(200).send({ success: true });
	});

	await fastify.listen({ port: port, host: 'localhost' });
}

export default launch;
