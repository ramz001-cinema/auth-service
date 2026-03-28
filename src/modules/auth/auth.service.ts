import { Injectable } from "@nestjs/common";
import { OtpType, SendOtpRequest } from "@ramz001-cinema/contracts/gen/auth";
import { AuthRepository } from "./auth.repository";
import { User } from "@prisma/generated/client";
import { OtpService } from "../otp/otp.service";

@Injectable()
export class AuthService {
  constructor(
    private readonly authRepository: AuthRepository,
    private readonly otpService: OtpService,
  ) {}

  async sendOtp(data: SendOtpRequest) {
    const { id, type } = data;
    console.log(data);

    let user: User | null = null;

    switch (type) {
      case OtpType.OTP_TYPE_PHONE:
        user = await this.authRepository.findByPhone(id);
        break;
      case OtpType.OTP_TYPE_EMAIL:
        user = await this.authRepository.findByEmail(id);
        break;
    }

    if (!user) {
      await this.authRepository.createUser({
        email: type === OtpType.OTP_TYPE_EMAIL ? id : undefined,
        phone: type === OtpType.OTP_TYPE_PHONE ? id : undefined,
      });
    }
    const code = await this.otpService.sendOtp(id, type);

    console.info(`OTP code for ${id} is ${code}`);

    return { ok: true };
  }
}
