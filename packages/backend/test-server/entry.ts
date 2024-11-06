import { portToPid } from 'pid-port';
import fkill from 'fkill';
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
	await killTestServer();

	console.log(`launching application... (pid: ${process.pid}, ppid: ${process.ppid})`);

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
 * 既に重複したポートで待ち受けしているサーバがある場合はkillする
 */
async function killTestServer() {
	//
	try {
		const pid = await portToPid(config.port);
		console.log(`Test server process's pid is ${pid}`);
		if (pid) {
			await fkill(pid, { force: true });
		}
	} catch (e) {
		// NOP;
		console.log('Failed to kill test server:', (e as any)?.message);
	}

	// kill env update/reset server
	try {
		const pid = await portToPid(config.port + 1000);
		console.log(`Env update/reset server process's pid is ${pid}`);
		if (pid) {
			await fkill(pid, { force: true });
		}
	} catch (e) {
		// NOP;
		console.log('Failed to kill env update/reset server:', (e as any)?.message);
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
		process.env = JSON.parse(originEnv);

		// FIXME: dispose()のPromiseが返ってくるのを待たないと、killTestServerで強制的にプロセスを終了することになるのでなんとかしたい
		await new Promise<void>(resolve => {
			const timerId = setTimeout(() => {
				console.log('force exiting server service');
				resolve();
			}, 1000 * 10);
			serverService.dispose().then(() => {
				clearTimeout(timerId);
				resolve();
			});
		});

		// FIXME: 上と同じ
		await new Promise<void>(resolve => {
			const timerId = setTimeout(() => {
				console.log('force exiting application');
				resolve();
			}, 1000 * 10);
			app.close().then(() => {
				clearTimeout(timerId);
				resolve();
			});
		});

		await killTestServer();

		console.log(`restarting application... (pid: ${process.pid}, ppid: ${process.ppid})`);

		app = await NestFactory.createApplicationContext(MainModule, {
			logger: new NestLogger(),
		});
		app.enableShutdownHooks();
		serverService = app.get(ServerService);
		await serverService.launch();

		res.code(200).send({ success: true });
	});

	await fastify.listen({ port: port, host: 'localhost' });
}

export default launch;
