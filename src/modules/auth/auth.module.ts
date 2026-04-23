import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { OtpService } from '../otp/otp.service'
import { PassportModule } from '@ramz001-cinema/passport'

@Module({
	imports: [PassportModule.register({ secretKey: '123456' })],
	controllers: [AuthController],
	providers: [AuthService, AuthRepository, OtpService]
})
export class AuthModule {}
