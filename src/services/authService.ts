import axios from 'axios'
import api from './api'
import type {
  AuthUser,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  Role,
} from '@/types/auth'

function normalizeRole(role: string): Role {
  const value = role.toUpperCase().replace(/^ROLE_/, '')
  if (value === 'ADMIN' || value === 'CUSTOMER') return value
  throw new Error(`Unknown role returned by server: ${role}`)
}

/** Turns an Axios error into a user-friendly Error. */
function toFriendlyError(error: unknown, fallback: string, statusMessages: Record<number, string> = {}) {
  if (!axios.isAxiosError(error)) return error
  if (!error.response) {
    return new Error('Cannot reach the server. Please try again later.', { cause: error })
  }
  const known = statusMessages[error.response.status]
  if (known) return new Error(known, { cause: error })
  const message = (error.response.data as { message?: string } | undefined)?.message
  return new Error(message ?? fallback, { cause: error })
}

export async function login(request: LoginRequest): Promise<{ token: string; user: AuthUser }> {
  try {
    const { data } = await api.post<LoginResponse>('/auth/login', request)
    return {
      token: data.token,
      user: {
        id: data.id,
        name: data.name,
        email: data.email,
        role: normalizeRole(data.role),
      },
    }
  } catch (error) {
    throw toFriendlyError(error, 'Login failed. Please try again.', {
      401: 'Invalid email or password.',
      403: 'Invalid email or password.',
    })
  }
}

/** Creates a new CUSTOMER account. Admin accounts are never created from the frontend. */
export async function register(request: RegisterRequest): Promise<void> {
  try {
    await api.post('/auth/register', request)
  } catch (error) {
    throw toFriendlyError(error, 'Sign up failed. Please try again.', {
      409: 'An account with this email already exists.',
    })
  }
}
