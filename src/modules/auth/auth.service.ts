import { Injectable } from '@nestjs/common'
import {
	SendOtpRequest,
	VerifyOtpRequest
} from '@ramz001-cinema/contracts/gen/auth/v1'
import { GrpcException } from '@ramz001-cinema/contracts'
import { OtpService } from '../otp/otp.service'
import { RedisKeys } from '@/infrastructure/redis/redis.constants'
import { UserRepository } from '../user/user.repository'
import { TokenService } from '../token/token.service'
import { RefreshTokenRequest } from '@ramz001-cinema/contracts/gen/auth/v1'

@Injectable()
export class AuthService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly otpService: OtpService,
		private readonly tokenService: TokenService
	) {}

	// Handles the logic for sending an OTP code to the user based on the provided identifier (phone or email)
	async sendOtp(data: SendOtpRequest) {
		const { identifier, type } = data

		const user = await this.userRepository.findByContact(identifier, type)

		if (!user) throw GrpcException.notFound('User not found')

		const code = await this.otpService.create({
			key: RedisKeys.otp(identifier, type)
		})

		console.info(`OTP code for ${identifier} is ${code}`)

		return { ok: true }
	}

	// Verifies the provided OTP code and generates tokens if valid
	async verifyOtp(data: VerifyOtpRequest) {
		const { identifier, type, otp } = data

		const user = await this.userRepository.findByContact(identifier, type)

		if (!user) throw GrpcException.notFound('User not found')

		await this.otpService.verify({
			key: RedisKeys.otp(identifier, type),
			code: otp
		})

		await this.userRepository.verifyContact(identifier, type)

		return this.tokenService.generate(user.id)
	}

	refreshToken(data: RefreshTokenRequest) {
		return this.tokenService.refresh(data)
	}
}
