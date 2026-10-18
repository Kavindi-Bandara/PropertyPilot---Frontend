import { useState, type FormEvent } from 'react'
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom'
import { AlertCircle, CheckCircle2, Loader2, Mail, ShieldCheck, User } from 'lucide-react'
import { AuthLayout } from '@/components/AuthLayout'
import { PasswordInput } from '@/components/PasswordInput'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useAuth } from '@/hooks/useAuth'
import { homePathFor } from '@/lib/routes'
import { EMAIL_PATTERN } from '@/lib/validation'
import type { Role } from '@/types/auth'

interface LoginLocationState {
  from?: { pathname: string }
  registered?: boolean
  email?: string
}

export default function LoginPage() {
  const { user, login, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as LoginLocationState | null

  const [role, setRole] = useState<Role>('CUSTOMER')
  const [email, setEmail] = useState(state?.email ?? '')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string }>({})
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={homePathFor(user.role)} replace />
  }

  function validate() {
    const errors: typeof fieldErrors = {}
    if (!email.trim()) errors.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'
    if (!password) errors.password = 'Password is required.'
    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const loggedIn = await login({ email: email.trim(), password }, remember)

      // The selected tab must match the account's real role.
      if (loggedIn.role !== role) {
        logout()
        setError(
          role === 'ADMIN'
            ? 'This account does not have admin access.'
            : 'This is an admin account. Please use the Admin tab.',
        )
        return
      }

      navigate(state?.from?.pathname ?? homePathFor(loggedIn.role), { replace: true })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const isAdmin = role === 'ADMIN'

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Welcome back</CardTitle>
          <CardDescription>
            {isAdmin
              ? 'Sign in to manage property listings.'
              : 'Sign in to explore available properties.'}
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Tabs
            value={role}
            onValueChange={(value) => {
              setRole(value as Role)
              setError(null)
            }}
          >
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="CUSTOMER">
                <User />
                Customer
              </TabsTrigger>
              <TabsTrigger value="ADMIN">
                <ShieldCheck />
                Admin
              </TabsTrigger>
            </TabsList>
          </Tabs>

          {state?.registered && !error && (
            <Alert>
              <CheckCircle2 className="text-emerald-600" />
              <AlertDescription>Account created successfully. Please sign in.</AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form id="login-form" onSubmit={handleSubmit} noValidate className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder={isAdmin ? 'admin@propertypilot.com' : 'you@example.com'}
                  className="pl-9"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  aria-invalid={!!fieldErrors.email}
                  disabled={submitting}
                />
              </div>
              {fieldErrors.email && <p className="text-sm text-destructive">{fieldErrors.email}</p>}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="password">Password</Label>
                <a
                  href="#"
                  className="text-sm text-muted-foreground hover:text-foreground hover:underline"
                >
                  Forgot password?
                </a>
              </div>
              <PasswordInput
                id="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                aria-invalid={!!fieldErrors.password}
                disabled={submitting}
              />
              {fieldErrors.password && (
                <p className="text-sm text-destructive">{fieldErrors.password}</p>
              )}
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="remember"
                checked={remember}
                onCheckedChange={(checked) => setRemember(checked === true)}
                disabled={submitting}
              />
              <Label htmlFor="remember" className="font-normal">
                Remember me
              </Label>
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button type="submit" form="login-form" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? 'Signing in…' : `Sign in as ${isAdmin ? 'Admin' : 'Customer'}`}
          </Button>
          {!isAdmin && (
            <p className="text-center text-sm text-muted-foreground">
              Don&apos;t have an account?{' '}
              <Link to="/signup" className="font-medium text-foreground hover:underline">
                Sign up
              </Link>
            </p>
          )}
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
