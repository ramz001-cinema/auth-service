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
		return this.telegramService.verify(data)
	}
}
