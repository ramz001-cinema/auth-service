import { Controller } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { GrpcMethod } from '@nestjs/microservices'
import * as v1 from '@ramz001-cinema/contracts/gen/auth/v1'

@Controller()
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@GrpcMethod('AuthService', 'TelegramInit')
	getAuthUrl() {
		return this.telegramService.getAuthUrl()
	}

	@GrpcMethod('AuthService', 'TelegramVerify')
	async verify(
		data: v1.TelegramVerifyRequest
	): Promise<v1.TelegramVerifyResponse> {
		return await this.telegramService.verify(data)
	}

	@GrpcMethod('AuthService', 'TelegramComplete')
	async complete(
		data: v1.TelegramCompleteRequest
	): Promise<v1.TelegramCompleteResponse> {
		console.log('Received TelegramCompleteRequest:', data)

		return await this.telegramService.complete(data)
	}
}
