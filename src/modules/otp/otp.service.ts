import { RedisService } from '@/infrastructure/redis/redis.service'
import { Injectable } from '@nestjs/common'
import { GrpcException } from '@ramz001-cinema/contracts'
import { createHash, randomInt } from 'node:crypto'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'
import { RedisKeys } from '@/infrastructure/redis/redis.constants'

@Injectable()
export class OtpService {
	constructor(private readonly redisService: RedisService) {}

	async send(id: string, type: ContactType) {
		const { hash, code } = this.generateCode()

		await this.redisService.set(RedisKeys.otp(type, id), hash, 'EX', 300)

		return code
	}

	async verify(id: string, type: ContactType, code: string) {
		const storedHash = await this.redisService.get(RedisKeys.otp(type, id))

		if (!storedHash)
			throw GrpcException.notFound('Otp not found or expired')

		const incomingHash = createHash('sha256').update(code).digest('hex')

		if (incomingHash !== storedHash)
			throw GrpcException.invalidArgument('Invalid OTP')

		await this.redisService.del(RedisKeys.otp(type, id))
	}

	private generateCode() {
		const code = randomInt(100000, 1000000).toString()
		const hash = createHash('sha256').update(code).digest('hex')

		return { hash, code }
	}
}
