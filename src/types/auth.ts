export type Role = 'ADMIN' | 'CUSTOMER'

export interface AuthUser {
  id?: number | string
  name?: string
  email: string
  role: Role
}

export interface LoginRequest {
  email: string
  password: string
}

/**
 * Expected response from the Spring Boot `POST /api/auth/login` endpoint.
 * `role` may come back as "ADMIN" or "ROLE_ADMIN" — both are accepted.
 */
export interface LoginResponse {
  token: string
  id?: number | string
  name?: string
  email: string
  role: string
}

/** Body for the Spring Boot `POST /api/auth/register` endpoint (customers only). */
export interface RegisterRequest {
  fullName: string
  email: string
  phone: string
  password: string
}
