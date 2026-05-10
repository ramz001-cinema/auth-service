import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'

@Injectable()
export class AccountRepository {
	constructor(private readonly prismaService: PrismaService) {}

	private now() {
		return new Date()
	}

	async findById(id: string) {
		return await this.prismaService.user.findUnique({
			where: { id },
			select: {
				id: true,
				email: true,
				phone: true,
				phoneVerifiedAt: true,
				emailVerifiedAt: true,
				role: true
			}
		})
	}

	async updateByContact(id: string, type: ContactType, newContact: string) {
		return await this.prismaService.user.update({
			where: { id },
			data:
				type === ContactType.CONTACT_TYPE_EMAIL
					? { email: newContact, emailVerifiedAt: this.now() }
					: { phone: newContact, phoneVerifiedAt: this.now() }
		})
	}
}
