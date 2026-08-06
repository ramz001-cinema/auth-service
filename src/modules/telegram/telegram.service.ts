import { EnvType } from '@/common/config'
import { Injectable } from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import { TelegramRepository } from './telegram.repository'
import { TelegramVerifyRequest } from '@ramz001-cinema/contracts/gen/auth/v1'
import { RedisService } from '@/infrastructure/redis/redis.service'
import { createHash, createHmac, randomBytes } from 'node:crypto'
import { RedisKeys } from '@/infrastructure/redis/redis.constants'
import { TokenService } from '../token/token.service'
import { GrpcException } from '@ramz001-cinema/contracts'
import { timingSafeEqual } from 'node:crypto'

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
		const isValid = this.verifyAuth(data.authResult)

		if (!isValid) {
			return GrpcException.permissionDenied('Invalid Telegram signature')
		}

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

	private verifyAuth(query: Record<string, string>) {
		const hash = query.hash
		if (!hash) return false

		const dataCheckString = Object.keys(query)
			.filter(key => key !== 'hash')
			.sort()
			.map(key => `${key}=${query[key]}`)
			.join('\n')

		const secretKey = createHash('sha256').update(this.BOT_TOKEN).digest() // raw Buffer
		const hmac = createHmac('sha256', secretKey)
			.update(dataCheckString)
			.digest() // raw Buffer

		// optional: reject data older than 24h
		const authDate = Number(query.auth_date)
		if (!authDate || Date.now() / 1000 - authDate > 86400) return false

		const expected = Buffer.from(hash, 'hex')
		return (
			hmac.length === expected.length && timingSafeEqual(hmac, expected)
		)
	}
}
