import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { PassportService } from '@ramz001-cinema/passport'
import { EnvType } from '@/common/config'
import { RefreshTokenRequest } from '@ramz001-cinema/contracts/gen/auth/v1'
import { GrpcException } from '@ramz001-cinema/contracts'

@Injectable()
export class TokenService {
	private readonly ACCESS_TOKEN_TTL: number
	private readonly REFRESH_TOKEN_TTL: number

	constructor(
		private readonly configService: ConfigService<EnvType>,
		private readonly passportService: PassportService
	) {
		this.ACCESS_TOKEN_TTL =
			this.configService.get<number>('PASSPORT_ACCESS_TTL') || 900 // default to 15 minutes
		this.REFRESH_TOKEN_TTL =
			this.configService.get<number>('PASSPORT_REFRESH_TTL') || 86400 // default to 24 hours
	}

	refresh(data: RefreshTokenRequest) {
		const { refreshToken } = data

		const result = this.passportService.verify(refreshToken)

		if (!result.valid) {
			throw GrpcException.unauthenticated(
				result.reason || 'Invalid refresh token'
			)
		}
		if (!result.userId) {
			throw GrpcException.invalidArgument(
				'Invalid token payload: missing userId'
			)
		}

		return this.generate(result.userId)
	}

	// Generates access and refresh tokens for a given user ID
	generate(userId: string) {
		return {
			accessToken: this.passportService.generate(
				userId,
				this.ACCESS_TOKEN_TTL
			),
			refreshToken: this.passportService.generate(
				userId,
				this.REFRESH_TOKEN_TTL
			)
		}
	}
}
