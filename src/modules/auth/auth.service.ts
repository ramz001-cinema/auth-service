import { Injectable } from "@nestjs/common";
import {
  OtpType,
  type SendOtpRequest,
} from "@ramz001-cinema/contracts/gen/auth";
import type { AuthRepository } from "./auth.repository";
import type { User } from "@prisma/generated/client";

@Injectable()
export class AuthService {
  constructor(private readonly authRepository: AuthRepository) {}

  async sendOtp(data: SendOtpRequest) {
    const { id, type } = data;

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
    return { ok: true };
  }
}
