import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/infrastructure/prisma/prisma.service'

@Injectable()
export class TelegramRepository {
	constructor(private readonly prismaService: PrismaService) {}

	async findByTelegramId(id: string) {
		return await this.prismaService.user.findUnique({
			where: { telegramId: id }
		})
	}
}
