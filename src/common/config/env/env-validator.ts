import z from 'zod'

const envSchema = z.object({
	AUTH_GRPC_URL: z.url().nonempty(),
	DATABASE_URL: z.url().nonempty(),
	REDIS_USER: z.string().nonempty(),
	REDIS_PASSWORD: z.string().nonempty(),
	REDIS_HOST: z.string().nonempty(),
	REDIS_PORT: z.coerce.number().int().min(1).max(65535),
	PASSPORT_SECRET_KEY: z.string().nonempty(),
	PASSPORT_ACCESS_TTL: z.coerce.number().int().positive().min(60).max(3600), // at least 1 minute, max 1 hour
	PASSPORT_REFRESH_TTL: z.coerce
		.number()
		.int()
		.positive()
		.min(3600)
		.max(2592000) // at least 1 hour, max 30 days
})

export function validateEnv(config: Record<string, unknown>) {
	return envSchema.parse(config)
}

export type EnvType = z.infer<typeof envSchema>
