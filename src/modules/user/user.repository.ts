import { PrismaService } from '@/infrastructure/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'

@Injectable()
export class UserRepository {
	constructor(private readonly prismaService: PrismaService) {}

	private now() {
		return new Date()
	}

	// This method is used to find a user by their contact information (email or phone) based on the type of contact provided.
	async findByContact(identifier: string, type: ContactType) {
		return await this.prismaService.user.findUnique({
			where:
				type === ContactType.CONTACT_TYPE_PHONE
					? { phone: identifier }
					: { email: identifier }
		})
	}

	// This method is used to find a user by their unique identifier (ID) and select specific fields to return, such as email, phone, verification status, and role.
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

	// This method is used to update the contact information (email or phone) of a user based on their user ID and the type of contact they want to update.
	async updateByContact(
		user_id: string,
		type: ContactType,
		newContact: string
	) {
		return await this.prismaService.user.update({
			where: { id: user_id },
			data:
				type === ContactType.CONTACT_TYPE_EMAIL
					? { email: newContact, emailVerifiedAt: this.now() }
					: { phone: newContact, phoneVerifiedAt: this.now() }
		})
	}

	// This method is used to verify the contact (email or phone) of a user by updating the corresponding verifiedAt field.
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
