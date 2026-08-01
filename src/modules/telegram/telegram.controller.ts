import { Controller } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { GrpcMethod } from '@nestjs/microservices'

@Controller()
export class TelegramController {
	constructor(private readonly telegramService: TelegramService) {}

	@GrpcMethod('AuthService', 'TelegramInit')
	getAuthUrl() {
		return this.telegramService.getAuthUrl()
	}
}
