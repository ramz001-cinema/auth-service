import { INestApplication } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { MicroserviceOptions } from '@nestjs/microservices'
import { Transport } from '@nestjs/microservices'
import { grpcLoader, grpcPackages, grpcProtoPaths } from './grpc.options'
import { EnvType } from '@/common/config'

export function createGrpcServer(app: INestApplication) {
	const config = app.get(ConfigService<EnvType>)

	app.connectMicroservice<MicroserviceOptions>({
		transport: Transport.GRPC,
		options: {
			package: grpcPackages,
			protoPath: grpcProtoPaths,
			url: config.getOrThrow<string>('AUTH_GRPC_URL'),
			loader: grpcLoader
		}
	})
}
