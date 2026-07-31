import { EnvType } from '@/common/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'

@Injectable()
export class TelegramService {
	private readonly BOT_ID: string
	private readonly BOT_TOKEN: string
	private readonly BOT_USERNAME: string
	private readonly REDIRECT_ORIGIN: string

	constructor(private readonly configService: ConfigService<EnvType>) {
		this.BOT_ID = this.configService.get('TELEGRAM_BOT_ID') || ''
		this.BOT_TOKEN = this.configService.get('TELEGRAM_BOT_TOKEN') || ''
		this.BOT_USERNAME =
			this.configService.get('TELEGRAM_BOT_USERNAME') || ''
		this.REDIRECT_ORIGIN =
			this.configService.get('TELEGRAM_REDIRECT_ORIGIN') || ''
	}
}
