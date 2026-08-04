import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegramController } from './telegram.controller'
import { TelegramRepository } from './telegram.repository'
import { TokenService } from '../token/token.service'

@Module({
	controllers: [TelegramController],
	providers: [TelegramService, TelegramRepository, TokenService]
})
export class TelegramModule {}
