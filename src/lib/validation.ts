export const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

// Optional leading +, then 9–15 digits (spaces and dashes allowed), e.g. 0771234567 or +94 77 123 4567
export const PHONE_PATTERN = /^\+?[0-9][0-9\s-]{8,16}$/

export const MIN_PASSWORD_LENGTH = 8
