import { RedisService } from '@/infrastructure/redis/redis.service'
import { Injectable } from '@nestjs/common'
import { GrpcException } from '@ramz001-cinema/contracts'
import { createHash, randomInt, timingSafeEqual } from 'node:crypto'
import { ConfigService } from '@nestjs/config'
import { EnvType } from '@/common/config'

type CreateOtpOptions<T = Record<string, unknown>> = {
	key: string
	ttl?: number
	data?: T
}

type VerifyOtpOptions = {
	key: string
	code: string
}

type OtpRecord<T = Record<string, unknown>> = {
	hash: string
	data?: T
}

@Injectable()
export class OtpService {
	private readonly OTP_TTL: number
	private readonly OTP_SECRET: string

	constructor(
		private readonly redisService: RedisService,
		private readonly configService: ConfigService<EnvType>
	) {
		this.OTP_TTL = this.configService.get('OTP_TTL') || 300
		this.OTP_SECRET = this.configService.get('OTP_SECRET_KEY') || ''
	}

	async create<T = Record<string, unknown>>(options: CreateOtpOptions<T>) {
		const { key, ttl = this.OTP_TTL, data } = options

		const code = this.generateCode()

		const payload: OtpRecord<T> = {
			hash: this.hash(code),
			data
		}

		await this.redisService.set(key, JSON.stringify(payload), 'EX', ttl)

		return code
	}

	async verify<T = Record<string, unknown>>(
		options: VerifyOtpOptions
	): Promise<T | undefined> {
		const { key, code } = options

		const raw = await this.redisService.get(key)

		if (!raw) throw GrpcException.notFound('Otp not found or expired')

		const payload = JSON.parse(raw) as OtpRecord<T>

		const incomingHash = this.hash(code)

		if (incomingHash.length !== payload.hash.length) {
			throw GrpcException.invalidArgument('Invalid OTP')
		}

		const valid = timingSafeEqual(
			Buffer.from(incomingHash, 'hex'),
			Buffer.from(payload.hash, 'hex')
		)

		if (!valid) throw GrpcException.invalidArgument('Invalid OTP')

		await this.redisService.del(key)

		return payload.data
	}

	private generateCode() {
		return randomInt(100000, 1000000).toString()
	}

	private hash(value: string) {
		return createHash('sha256')
			.update(value + this.OTP_SECRET)
			.digest('hex')
	}
}
