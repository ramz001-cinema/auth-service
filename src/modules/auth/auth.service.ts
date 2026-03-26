import { Injectable } from "@nestjs/common";
import type { SendOtpRequest } from "@ramz001-cinema/contracts/gen/auth";

@Injectable()
export class AuthService {
  async sendOtp(data: SendOtpRequest) {}
}
