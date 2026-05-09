import { Injectable } from '@nestjs/common'
import {
	GetProfileRequest,
	GetProfileResponse
} from '@ramz001-cinema/contracts/gen/account/v1'
import { Role } from '@ramz001-cinema/contracts/gen/common/v1'
import { convertEnum, GrpcException } from '@ramz001-cinema/contracts'
import { AccountRepository } from './account.repository'
import { convertDateToString } from '@/common/utils'

@Injectable()
export class AccountService {
	constructor(private readonly accountRepository: AccountRepository) {}

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
}
