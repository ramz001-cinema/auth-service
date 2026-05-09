import { ContactType } from '@ramz001-cinema/contracts/gen/common/v1'

enum RedisKey {
	OTP = 'otp',
	PENDING_CONTACT_CHANGE = 'pending-contact-change'
}

export class RedisKeys {
	static otp(type: ContactType, id: string) {
		return `${RedisKey.OTP}:${type}:${id}`
	}

	static pendingContactChange(id: string, type: ContactType) {
		return `${RedisKey.PENDING_CONTACT_CHANGE}:${type}:${id}`
	}
}
