import { Module } from "@nestjs/common";
import { AuthModule } from "./modules/auth/auth.module";
import { ConfigModule } from "@nestjs/config";
import { PrismaModule } from "./infrastructure/prisma/prisma.module";
import { RedisModule } from "./infrastructure/redis/redis.module";
import { OtpModule } from './modules/otp/otp.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    PrismaModule,
    RedisModule,
    OtpModule,
  ],
})
export class AppModule {}
