import z from 'zod'

const envSchema = z.object({
	AUTH_GRPC_URL: z.url().nonempty(),
	DATABASE_URL: z.url().nonempty(),
	REDIS_USER: z.string().nonempty(),
	REDIS_PASSWORD: z.string().nonempty(),
	REDIS_HOST: z.string().nonempty(),
	REDIS_PORT: z.coerce.number().int().min(1).max(65535)
})

export function validateEnv(config: Record<string, unknown>) {
	return envSchema.parse(config)
}
