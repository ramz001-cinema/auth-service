import { Module } from '@nestjs/common'
import { TokenService } from './token.service'
import { PassportModule } from '@ramz001-cinema/passport'
import { ConfigService } from '@nestjs/config'
import { EnvType } from '@/common/config'

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
	providers: [TokenService],
	exports: [TokenService]
})
export class TokenModule {}
