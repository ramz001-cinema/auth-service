import { Controller } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { GrpcMethod } from "@nestjs/microservices";
import type {
  SendOtpRequest,
  SendOtpResponse,
} from "@ramz001-cinema/contracts/gen/auth";

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @GrpcMethod("AuthService", "SendOtp")
  async sendOtp(data: SendOtpRequest): Promise<SendOtpResponse> {
    return await this.authService.sendOtp(data);
  }
}
