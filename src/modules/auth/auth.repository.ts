import { PrismaService } from "@/infrastructure/prisma/prisma.service";
import { Injectable } from "@nestjs/common";
import { User } from "@prisma/generated/client";
import { UserCreateInput } from "@prisma/generated/models";

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

  async createUser(data: UserCreateInput): Promise<User> {
    return await this.prismaService.user.create({
      data,
    });
  }
}
