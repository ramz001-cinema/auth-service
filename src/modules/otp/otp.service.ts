import { RedisService } from '@/infrastructure/redis/redis.service'
import { Injectable } from '@nestjs/common'
import { GrpcException } from '@ramz001-cinema/contracts'
import { createHash, randomInt } from 'node:crypto'
import { OtpType } from '@ramz001-cinema/contracts/gen/auth'

@Injectable()
export class OtpService {
	constructor(private readonly redisService: RedisService) {}

	async send(id: string, type: OtpType) {
		const { hash, code } = this.generateCode()

		await this.redisService.set(`otp:${type}:${id}`, hash, 'EX', 300)
		return code
	}

	async verify(id: string, type: OtpType, code: string) {
		const storedHash = await this.redisService.get(`otp:${type}:${id}`)

		if (!storedHash)
			throw GrpcException.notFound('Otp not found or expired')

		const incomingHash = createHash('sha256').update(code).digest('hex')

		if (incomingHash !== storedHash)
			throw GrpcException.invalidArgument('Invalid OTP')

		await this.redisService.del(`otp:${type}:${id}`)
	}

	private generateCode() {
		const code = randomInt(100000, 1000000).toString()
		const hash = createHash('sha256').update(code).digest('hex')

		return { hash, code }
	}
}
