import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class AccountRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findById(id: string) {
		return this.prismaService.user.findUnique({
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
}
