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
import { AccountRepository } from './account.repository'
import { convertDateToString } from '@/common/utils'
import { OtpService } from '../otp/otp.service'
import { RedisKeys } from '@/infrastructure/redis/redis.constants'

@Injectable()
export class AccountService {
	constructor(
		private readonly accountRepository: AccountRepository,
		private readonly otpService: OtpService
	) {}

	async getProfile(data: GetProfileRequest): Promise<GetProfileResponse> {
		const { id } = data

		const user = await this.accountRepository.findById(id)

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
		const { id, newContact, type } = data

		const user = await this.accountRepository.findById(id)

		if (!user) throw GrpcException.notFound('Account not found')

		const otp = await this.otpService.create({
			key: RedisKeys.pendingContactChange(id, type),
			data: { newContact }
		})

		console.info(
			`OTP for confirming ${type} change for user ${id} is ${otp}`
		)

		return { ok: true }
	}

	async confirmContactChange(
		data: ConfirmContactChangeRequest
	): Promise<ConfirmContactChangeResponse> {
		const { id, type, otp } = data

		const result = await this.otpService.verify<{ newContact: string }>({
			key: RedisKeys.pendingContactChange(id, type),
			code: otp
		})

		if (!result?.newContact) {
			throw GrpcException.notFound('No pending contact change found')
		}

		await this.accountRepository.updateByContact(
			id,
			type,
			result.newContact
		)

		return { ok: true }
	}
}
