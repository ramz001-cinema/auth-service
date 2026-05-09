import { PrismaService } from '@/infrastructure/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'

@Injectable()
export class AuthRepository {
	constructor(private readonly prismaService: PrismaService) {}

	private now() {
		return new Date()
	}

	async findByContact(identifier: string, type: ContactType) {
		return await this.prismaService.user.findUnique({
			where:
				type === ContactType.CONTACT_TYPE_PHONE
					? { phone: identifier }
					: { email: identifier }
		})
	}

	async verifyContact(identifier: string, type: ContactType) {
		return await this.prismaService.user.update({
			where:
				type === ContactType.CONTACT_TYPE_PHONE
					? { phone: identifier }
					: { email: identifier },
			data:
				type === ContactType.CONTACT_TYPE_PHONE
					? { phoneVerifiedAt: this.now() }
					: { emailVerifiedAt: this.now() }
		})
	}
}
