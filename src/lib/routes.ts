import type { Role } from '@/types/auth'

export const homePathFor = (role: Role) => (role === 'ADMIN' ? '/admin' : '/properties')
