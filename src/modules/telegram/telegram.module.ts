import { Module } from '@nestjs/common'
import { TelegramService } from './telegram.service'
import { TelegramController } from './telegram.controller'
import { TelegramRepository } from './telegram.repository'

@Module({
	controllers: [TelegramController],
	providers: [TelegramService, TelegramRepository]
})
export class TelegramModule {}
