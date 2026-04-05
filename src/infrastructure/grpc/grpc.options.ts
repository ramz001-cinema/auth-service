import { GrpcOptions } from '@nestjs/microservices'
import { PROTO_PATHS } from '@ramz001-cinema/contracts'

export const grpcPackages = ['auth.v1']

export const grpcProtoPaths = [PROTO_PATHS.AUTH]

export const gprcLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	defaults: true,
	oneofs: true
}
