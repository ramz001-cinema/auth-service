import { Module } from '@nestjs/common'
import { AuthModule } from './modules/auth/auth.module'
import { ConfigModule } from '@nestjs/config'
import { PrismaModule } from './infrastructure/prisma/prisma.module'
import { RedisModule } from './infrastructure/redis/redis.module'
import { OtpModule } from './modules/otp/otp.module'
import { EnvType, validateEnv } from './common/config'

@Module({
	imports: [
		ConfigModule.forRoot<EnvType>({
			isGlobal: true,
			validate: validateEnv
		}),
		AuthModule,
		PrismaModule,
		RedisModule,
		OtpModule
	]
})
export class AppModule {}
