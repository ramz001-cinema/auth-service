import { Module } from '@nestjs/common'
import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'
import { AuthRepository } from './auth.repository'
import { OtpService } from '../otp/otp.service'
import { PassportModule } from '@ramz001-cinema/passport'
import { ConfigService } from '@nestjs/config'
import { EnvType } from '@/common/config'

@Module({
	imports: [
		PassportModule.registerAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService<EnvType>) => ({
				secretKey: configService.getOrThrow<string>(
					'PASSPORT_SECRET_KEY',
					{
						infer: true
					}
				)
			})
		})
	],
	controllers: [AuthController],
	providers: [AuthService, AuthRepository, OtpService]
})
export class AuthModule {}
