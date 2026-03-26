import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaClient } from "prisma/generated/client";
import { Logger } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private readonly logger = new Logger(PrismaService.name);

  constructor() {
    const adapter = new PrismaPg({
      connectionString: process.env.DATABASE_URL,
    });
    super({ adapter });
  }

  async onModuleInit() {
    const start = Date.now();
    this.logger.log("Connecting to the database...");

    try {
      await this.$connect();
      const duration = Date.now() - start;
      this.logger.log(`Database connection established in ${duration}ms`);
    } catch (error) {
      this.logger.error(`Failed to connect to the database: ${error}`);
      throw error;
    }
  }
  async onModuleDestroy() {
    this.logger.log("Disconnecting from the database...");

    try {
      await this.$disconnect();

      this.logger.log("Database connection closed successfully");
    } catch (error) {
      this.logger.error(`Failed to disconnect from the database: ${error}`);
      throw error;
    }
  }
}
