import { Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { UserRepository } from '../user/user.repository'

@Module({
	controllers: [AccountController],
	providers: [AccountService, UserRepository]
})
export class AccountModule {}
