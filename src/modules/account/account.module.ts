import { Module } from '@nestjs/common'
import { AccountService } from './account.service'
import { AccountController } from './account.controller'
import { UserRepository } from '../user/user.repository'
import { OtpService } from '../otp/otp.service'

@Module({
	controllers: [AccountController],
	providers: [AccountService, UserRepository, OtpService]
})
export class AccountModule {}
