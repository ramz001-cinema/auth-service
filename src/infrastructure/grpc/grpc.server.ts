import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'
import { gprcLoader, grpcPackages, grpcProtoPaths } from './grpc.options'

export function createGrpcServer(app: INestApplication) {
	const config = app.get(ConfigService)

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: grpcPackages,
			protoPath: grpcProtoPaths,
			url: config.getOrThrow<string>('AUTH_GRPC_URL'),
			loader: gprcLoader
		}
	})
}
