import { Injectable } from '@nestjs/common'
import {
	ConfirmContactChangeRequest,
	ConfirmContactChangeResponse,
	GetProfileRequest,
	GetProfileResponse,
	InitContactChangeRequest,
	InitContactChangeResponse
} from '@ramz001-cinema/contracts/gen/account/v1'
import { Role } from '@ramz001-cinema/contracts/gen/common/v1'
import { convertEnum, GrpcException } from '@ramz001-cinema/contracts'
import { convertDateToString } from '@/common/utils'
import { OtpService } from '../otp/otp.service'
import { RedisKeys } from '@/infrastructure/redis/redis.constants'
import { UserRepository } from '../user/user.repository'

@Injectable()
export class AccountService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly otpService: OtpService
	) {}

	async getProfile(data: GetProfileRequest): Promise<GetProfileResponse> {
		const { id } = data

		const user = await this.userRepository.findById(id)

		if (!user) {
			throw GrpcException.notFound('Account not found')
		}

		return {
			id: user.id,
			email: user.email || undefined,
			phone: user.phone ?? undefined,
			phoneVerifiedAt: convertDateToString(user.phoneVerifiedAt),
			emailVerifiedAt: convertDateToString(user.emailVerifiedAt),
			role: convertEnum(Role, user.role)
		}
	}

	async initContactChange(
		data: InitContactChangeRequest
	): Promise<InitContactChangeResponse> {
		const { userId, newContact, type } = data

		const user = await this.userRepository.findById(userId)

		if (!user) throw GrpcException.notFound('Account not found')

		const otp = await this.otpService.create({
			key: RedisKeys.pendingContactChange(userId, type),
			data: { newContact }
		})

		console.info(
			`OTP for confirming ${type} change for user ${userId} is ${otp}`
		)

		return { ok: true }
	}

	async confirmContactChange(
		data: ConfirmContactChangeRequest
	): Promise<ConfirmContactChangeResponse> {
		const { userId, type, otp } = data

		const result = await this.otpService.verify<{ newContact: string }>({
			key: RedisKeys.pendingContactChange(userId, type),
			code: otp
		})

		if (!result?.newContact) {
			throw GrpcException.notFound('No pending contact change found')
		}

		await this.userRepository.updateByContact(
			userId,
			type,
			result.newContact
		)

		return { ok: true }
	}
}
