import { GrpcOptions } from '@nestjs/microservices'
import { PROTO_PATHS } from '@ramz001-cinema/contracts'
import { AUTH_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/auth/v1'
import { ACCOUNT_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/account/v1'
import { COMMON_V1_PACKAGE_NAME } from '@ramz001-cinema/contracts/gen/common/v1'

export const grpcPackages = [
	AUTH_V1_PACKAGE_NAME,
	ACCOUNT_V1_PACKAGE_NAME,
	COMMON_V1_PACKAGE_NAME
]

export const grpcProtoPaths = [
	PROTO_PATHS.AUTH,
	PROTO_PATHS.ACCOUNT,
	PROTO_PATHS.COMMON
]

export const grpcLoader: NonNullable<GrpcOptions['options']['loader']> = {
	keepCase: false,
	longs: String,
	defaults: true,
	oneofs: true
}
