import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import { Transport, MicroserviceOptions } from '@nestjs/microservices'
import { ConfigService } from '@nestjs/config'

async function bootstrap() {
	const app = await NestFactory.create(AppModule)
	const config = app.get(ConfigService)

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: 'auth.v1',
			protoPath:
				'node_modules/@ramz001-cinema/contracts/proto/auth.proto',
			url: config.getOrThrow<string>('AUTH_GRPC_URL'),
			loader: {
				keepCase: false,
				longs: String,
				defaults: true,
				oneofs: true
			}
		}
	})

	await app.startAllMicroservices()
	await app.init()
}

void bootstrap()
