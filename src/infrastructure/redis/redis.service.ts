import {
	Injectable,
	Logger,
	OnModuleDestroy,
	OnModuleInit
} from '@nestjs/common'
import { ConfigService } from '@nestjs/config'
import Redis from 'ioredis'

@Injectable()
export class RedisService
	extends Redis
	implements OnModuleInit, OnModuleDestroy
{
	private readonly logger = new Logger(RedisService.name)
	constructor(private readonly configService: ConfigService) {
		super({
			host: configService.get<string>('REDIS_HOST'),
			port: configService.get<number>('REDIS_PORT'),
			password: configService.get<string>('REDIS_PASSWORD'),
			username: configService.get<string>('REDIS_USER'),
			maxRetriesPerRequest: 5,
			enableOfflineQueue: true
		})
	}

	onModuleInit() {
		const start = Date.now()
		this.logger.log('Initializing connection to Redis...')

		this.on('connect', () => this.logger.log('Connecting to Redis'))

		this.on('ready', () => {
			const ms = Date.now() - start
			this.logger.log(`Connected to Redis in ${ms}ms`)
		})

		this.on('error', error => {
			this.logger.error('Redis error:', {
				message: error?.message || error
			})
		})

		this.on('close', () => this.logger.warn('Redis connection closed'))

		this.on('reconnecting', () => this.logger.warn(`Reconnecting to Redis`))
	}
	async onModuleDestroy() {
		this.logger.log('Closing Redis connection...')
		try {
			await this.quit()
		} catch (error) {
			if (error instanceof Error) {
				this.logger.error('Error closing Redis connection:', {
					message: error.message
				})
			}
		}
	}
}
