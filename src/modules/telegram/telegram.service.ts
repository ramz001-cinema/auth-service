import { EnvType } from '@/common/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TelegramRepository } from './telegram.repository'
import { TelegramVerifyRequest } from '@ramz001-cinema/contracts/gen/auth/v1'

@Injectable()
export class TelegramService {
	private readonly BOT_ID: string
	private readonly BOT_TOKEN: string
	private readonly BOT_USERNAME: string
	private readonly REDIRECT_ORIGIN: string

	constructor(
		private readonly configService: ConfigService<EnvType>,
		private readonly telegramRepository: TelegramRepository
	) {
		this.BOT_ID = this.configService.get('TELEGRAM_BOT_ID') || ''
		this.BOT_TOKEN = this.configService.get('TELEGRAM_BOT_TOKEN') || ''
		this.BOT_USERNAME =
			this.configService.get('TELEGRAM_BOT_USERNAME') || ''
		this.REDIRECT_ORIGIN =
			this.configService.get('TELEGRAM_REDIRECT_ORIGIN') || ''
	}

	getAuthUrl() {
		const url = new URL('https://oauth.telegram.org/auth')

		url.searchParams.append('bot_id', this.BOT_ID)
		url.searchParams.append('origin', this.REDIRECT_ORIGIN)
		url.searchParams.append('request_access', 'write')
		url.searchParams.append(
			'return_to',
			this.REDIRECT_ORIGIN + '/auth/telegram'
		)

		return { url: url.href }
	}

	async verify(data: TelegramVerifyRequest) {
		const telegramId = data.authResult?.id

		const exists =
			await this.telegramRepository.findByTelegramId(telegramId)

		if (!exists){
			throw 
		}
	}
}
