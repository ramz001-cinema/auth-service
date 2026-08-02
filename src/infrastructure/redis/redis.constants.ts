import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'

enum RedisKey {
	OTP = 'otp',
	PENDING_CONTACT_CHANGE = 'pending-contact-change',
	TELEGRAM_SESSION = 'telegram-session'
}

export class RedisKeys {
	static otp(identifier: string, type: ContactType) {
		return `${RedisKey.OTP}:${type}:${identifier}`
	}

	static pendingContactChange(user_id: string, type: ContactType) {
		return `${RedisKey.PENDING_CONTACT_CHANGE}:${type}:${user_id}`
	}

	static telegramSession(sessionId: string) {
		return `${RedisKey.TELEGRAM_SESSION}:${sessionId}`
	}
}
