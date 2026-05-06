import { Controller } from '@nestjs/common'
import { AccountService } from './account.service'
import * as contracts from '@ramz001-cinema/contracts/gen/account'
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
}
