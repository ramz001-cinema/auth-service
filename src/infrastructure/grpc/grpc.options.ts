import { GrpcOptions } from '@nestjs/microservices'
import { PROTO_PATHS } from '@ramz001-cinema/contracts'
import { ACCOUNT_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/account'
import { AUTH_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/auth'

export const grpcPackages = [AUTH_V1_PACKAGE_NAME, ACCOUNT_V1_PACKAGE_NAME]

export const grpcProtoPaths = [PROTO_PATHS.AUTH, PROTO_PATHS.ACCOUNT]

export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	defaults: true,
	oneofs: true
}
