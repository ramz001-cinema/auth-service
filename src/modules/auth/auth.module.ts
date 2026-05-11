import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { OtpService } from '../otp/otp.service'
import { PassportModule } from '@ramz001-cinema/passport'
import { ConfigService } from '@nestjs/config'
import { EnvType } from '@/common/config'
import { UserRepository } from '../user/user.repository'

@Module({
	imports: [
		PassportModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<EnvType>) => ({
				secretKey: configService.getOrThrow<string>(
					'PASSPORT_SECRET_KEY'
				)
			})
		})
	],
	controllers: [AuthController],
	providers: [AuthService, UserRepository, OtpService]
})
export class AuthModule {}
