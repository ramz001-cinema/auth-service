import { Controller } from '@nestjs/common'
import { AuthService } from './auth.service'
import { GrpcMethod } from '@nestjs/microservices'
import * as auth from '@ramz001-cinema/contracts'

@Controller()
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@GrpcMethod('AuthService', 'SendOtp')
	async sendOtp(data: auth.SendOtpRequest): Promise<auth.SendOtpResponse> {
		return await this.authService.sendOtp(data)
	}

	@GrpcMethod('AuthService', 'VerifyOtp')
	async verifyOtp(
		data: auth.VerifyOtpRequest
	): Promise<auth.VerifyOtpResponse> {
		return await this.authService.verifyOtp(data)
	}
}
