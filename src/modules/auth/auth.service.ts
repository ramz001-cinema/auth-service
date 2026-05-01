import { Injectable } from '@nestjs/common'
import {
	OtpType,
	SendOtpRequest,
	VerifyOtpRequest,
	GrpcException,
	RefreshTokenRequest
} from '@ramz001-cinema/contracts'
import { AuthRepository } from './auth.repository'
import { User } from '@prisma/generated/client'
import { OtpService } from '../otp/otp.service'
import { PassportService } from '@ramz001-cinema/passport'
import { ConfigService } from '@nestjs/config'
import { EnvType } from '@/common/config'

@Injectable()
export class AuthService {
	private readonly ACCESS_TOKEN_TTL: number
	private readonly REFRESH_TOKEN_TTL: number

	constructor(
		private readonly configService: ConfigService<EnvType>,
		private readonly authRepository: AuthRepository,
		private readonly otpService: OtpService,
		private readonly passportService: PassportService
	) {
		this.ACCESS_TOKEN_TTL =
			this.configService.get<number>('PASSPORT_ACCESS_TTL') || 900 // default to 15 minutes
		this.REFRESH_TOKEN_TTL =
			this.configService.get<number>('PASSPORT_REFRESH_TTL') || 86400 // default to 24 hours
	}

	// Handles the logic for sending an OTP code to the user based on the provided identifier (phone or email)
	async sendOtp(data: SendOtpRequest) {
		const { id, type } = data

		let user: User | null = null

		switch (type) {
			case OtpType.OTP_TYPE_PHONE:
				user = await this.authRepository.findByPhone(id)
				break
			case OtpType.OTP_TYPE_EMAIL:
				user = await this.authRepository.findByEmail(id)
				break
		}

		if (!user) {
			await this.authRepository.createUser({
				email: type === OtpType.OTP_TYPE_EMAIL ? id : undefined,
				phone: type === OtpType.OTP_TYPE_PHONE ? id : undefined
			})
		}
		const code = await this.otpService.send(id, type)

		console.info(`OTP code for ${id} is ${code}`)

		return { ok: true }
	}

	// Verifies the provided OTP code and generates tokens if valid
	async verifyOtp(data: VerifyOtpRequest) {
		const { id, type, otp } = data

		await this.otpService.verify(id, type, otp)

		let user: User | null = null

		switch (type) {
			case OtpType.OTP_TYPE_PHONE:
				user = await this.authRepository.findByPhone(id)
				break
			case OtpType.OTP_TYPE_EMAIL:
				user = await this.authRepository.findByEmail(id)
				break
		}

		if (!user) throw GrpcException.notFound('User not found')

		if (type === OtpType.OTP_TYPE_EMAIL && !user.emailVerifiedAt) {
			await this.authRepository.updateUser(user.id, {
				emailVerifiedAt: new Date()
			})
		}

		if (type === OtpType.OTP_TYPE_PHONE && !user.phoneVerifiedAt) {
			await this.authRepository.updateUser(user.id, {
				phoneVerifiedAt: new Date()
			})
		}

		return this.generateTokens(user.id)
	}

	refreshToken(data: RefreshTokenRequest) {
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

		return this.generateTokens(result.userId)
	}

	// Generates access and refresh tokens for a given user ID
	private generateTokens(userId: string) {
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
