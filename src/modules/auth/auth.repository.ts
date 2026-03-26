import type { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import type { User } from "@prisma/generated/client";

@Injectable()
export class AuthRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findByPhone(phone: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { phone },
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await this.prismaService.user.findUnique({
      where: { email },
    });
  }
}
