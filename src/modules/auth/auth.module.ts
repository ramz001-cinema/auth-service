import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { OtpService } from '../otp/otp.service'
import { UserRepository } from '../user/user.repository'
import { TokenService } from '../token/token.service'

@Module({
	controllers: [AuthController],
	providers: [AuthService, UserRepository, OtpService, TokenService]
})
export class AuthModule {}
