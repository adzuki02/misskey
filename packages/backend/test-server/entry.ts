import Fastify from 'fastify';
import { NestFactory } from '@nestjs/core';
import { INestApplicationContext } from '@nestjs/common';
import { MainModule } from '@/MainModule.js';
import { ServerService } from '@/server/ServerService.js';
import { loadConfig } from '@/config.js';
import { NestLogger } from '@/NestLogger.js';

const config = loadConfig();
const originEnv = JSON.stringify(process.env);

process.env.NODE_ENV = 'test';

let app: INestApplicationContext;
let serverService: ServerService;

/**
 * テスト用のサーバインスタンスを起動する
 */
async function launch() {
	console.log('launching application...');

	app = await NestFactory.createApplicationContext(MainModule, {
		logger: new NestLogger(),
	});
	app.enableShutdownHooks();
	serverService = app.get(ServerService);
	await serverService.launch();

	await startControllerEndpoints();

	// ジョブキューは必要な時にテストコード側で起動する
	// ジョブキューが動くとテスト結果の確認に支障が出ることがあるので意図的に動かさないでいる

	console.log('application initialized.');
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
		process.env = JSON.parse(originEnv);

		console.log('stopping application...');

		await serverService.dispose();
		await app.close();

		console.log('restarting application...');

		app = await NestFactory.createApplicationContext(MainModule, {
			logger: new NestLogger(),
		});
		app.enableShutdownHooks();
		serverService = app.get(ServerService);
		await serverService.launch();

		console.log('application re-initialized.');

		res.code(200).send({ success: true });
	});

	await fastify.listen({ port: port, host: 'localhost' });
}

// eslint-disable-next-line import/no-default-export
export default launch;
