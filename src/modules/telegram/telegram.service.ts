import { EnvType } from '@/common/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TelegramRepository } from './telegram.repository'
import { TelegramVerifyRequest } from '@ramz001-cinema/contracts/gen/auth/v1'
import { RedisService } from '@/infrastructure/redis/redis.service'
import { randomBytes } from 'node:crypto'
import { RedisKeys } from '@/infrastructure/redis/redis.constants'
import { TokenService } from '../token/token.service'

@Injectable()
export class TelegramService {
	private readonly BOT_ID: string
	private readonly BOT_TOKEN: string
	private readonly BOT_USERNAME: string
	private readonly REDIRECT_ORIGIN: string

	constructor(
		private readonly configService: ConfigService<EnvType>,
		private readonly telegramRepository: TelegramRepository,
		private readonly redisService: RedisService,
		private readonly tokenService: TokenService
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

		if (exists && exists.phone && exists.id) {
			return this.tokenService.generate(exists.id)
		}

		const sessionId = randomBytes(16).toString('hex')

		await this.redisService.set(
			RedisKeys.telegramSession(sessionId),
			JSON.stringify({ id: telegramId, ...data?.authResult }),
			'EX',
			300 // 5 mins
		)

		return { url: `https://t.me/${this.BOT_USERNAME}?start=${sessionId}` }
	}
}
