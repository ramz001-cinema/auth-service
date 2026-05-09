import { Controller } from '@nestjs/common'
import { AccountService } from './account.service'
import * as contracts from '@ramz001-cinema/contracts/gen/account/v1'
import { GrpcMethod } from '@nestjs/microservices'

@Controller('account')
export class AccountController {
	constructor(private readonly accountService: AccountService) {}

	@GrpcMethod('AccountService', 'GetProfile')
	async getProfile(
		data: contracts.GetProfileRequest
	): Promise<contracts.GetProfileResponse> {
		return await this.accountService.getProfile(data)
	}

	@GrpcMethod('AccountService', 'InitContactChange')
	async initContactChange(
		data: contracts.InitContactChangeRequest
	): Promise<contracts.InitContactChangeResponse> {
		return await this.accountService.initContactChange(data)
	}

	@GrpcMethod('AccountService', 'ConfirmContactChange')
	async confirmContactChange(
		data: contracts.ConfirmContactChangeRequest
	): Promise<contracts.ConfirmContactChangeResponse> {
		return await this.accountService.confirmContactChange(data)
	}
}
