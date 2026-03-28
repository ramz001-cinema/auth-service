import { RedisService } from "@/infrastructure/redis/redis.service";
import { Injectable } from "@nestjs/common";
import { OtpType } from "@ramz001-cinema/contracts/gen/auth";
import { createHash } from "node:crypto";

@Injectable()
export class OtpService {
  constructor(private readonly redisService: RedisService) {}

  async sendOtp(id: string, type: OtpType) {
    const { hash, code } = this.generateCode();

    console.debug(hash, code);

    await this.redisService.set(`otp:${type}:${id}`, hash, "EX", 300);
    return code;
  }

  private generateCode() {
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const hash = createHash("sha256").update(code).digest("hex");

    return { hash, code };
  }
}
