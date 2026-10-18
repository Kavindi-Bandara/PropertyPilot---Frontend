import { useState, type ChangeEvent, type FormEvent } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { AlertCircle, Loader2, Mail, Phone, User } from 'lucide-react'
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
import { useAuth } from '@/hooks/useAuth'
import { homePathFor } from '@/lib/routes'
import { EMAIL_PATTERN, MIN_PASSWORD_LENGTH, PHONE_PATTERN } from '@/lib/validation'
import * as authService from '@/services/authService'

type Field = 'fullName' | 'email' | 'phone' | 'password' | 'confirmPassword' | 'terms'

const iconClass =
  'pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground'

export default function SignUpPage() {
  const { user } = useAuth()
  const navigate = useNavigate()

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<Field, string>>>({})
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) {
    return <Navigate to={homePathFor(user.role)} replace />
  }

  const update = (field: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) =>
    setForm((prev) => ({ ...prev, [field]: e.target.value }))

  function validate() {
    const errors: Partial<Record<Field, string>> = {}
    const { fullName, email, phone, password, confirmPassword } = form

    if (!fullName.trim()) errors.fullName = 'Full name is required.'
    else if (fullName.trim().length < 3) errors.fullName = 'Full name must be at least 3 characters.'

    if (!email.trim()) errors.email = 'Email is required.'
    else if (!EMAIL_PATTERN.test(email.trim())) errors.email = 'Enter a valid email address.'

    if (!phone.trim()) errors.phone = 'Phone number is required.'
    else if (!PHONE_PATTERN.test(phone.trim())) errors.phone = 'Enter a valid phone number.'

    if (!password) errors.password = 'Password is required.'
    else if (password.length < MIN_PASSWORD_LENGTH)
      errors.password = `Password must be at least ${MIN_PASSWORD_LENGTH} characters.`
    else if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password))
      errors.password = 'Password must contain both letters and numbers.'

    if (!confirmPassword) errors.confirmPassword = 'Please confirm your password.'
    else if (confirmPassword !== password) errors.confirmPassword = 'Passwords do not match.'

    if (!acceptTerms) errors.terms = 'You must accept the terms to continue.'

    setFieldErrors(errors)
    return Object.keys(errors).length === 0
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setError(null)
    if (!validate()) return

    setSubmitting(true)
    try {
      const email = form.email.trim()
      await authService.register({
        fullName: form.fullName.trim(),
        email,
        phone: form.phone.trim(),
        password: form.password,
      })
      navigate('/login', {
        replace: true,
        state: { registered: true, email },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Sign up failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const fieldError = (field: Field) =>
    fieldErrors[field] && <p className="text-sm text-destructive">{fieldErrors[field]}</p>

  return (
    <AuthLayout>
      <Card>
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl">Create an account</CardTitle>
          <CardDescription>Sign up as a customer to browse and enquire about properties.</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <form id="signup-form" onSubmit={handleSubmit} noValidate className="space-y-3">
            <div className="space-y-2">
              <Label htmlFor="fullName">Full name</Label>
              <div className="relative">
                <User className={iconClass} />
                <Input
                  id="fullName"
                  autoComplete="name"
                  placeholder="John Perera"
                  className="pl-9"
                  value={form.fullName}
                  onChange={update('fullName')}
                  aria-invalid={!!fieldErrors.fullName}
                  disabled={submitting}
                />
              </div>
              {fieldError('fullName')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className={iconClass} />
                <Input
                  id="email"
                  type="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                  className="pl-9"
                  value={form.email}
                  onChange={update('email')}
                  aria-invalid={!!fieldErrors.email}
                  disabled={submitting}
                />
              </div>
              {fieldError('email')}
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone number</Label>
              <div className="relative">
                <Phone className={iconClass} />
                <Input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  placeholder="077 123 4567"
                  className="pl-9"
                  value={form.phone}
                  onChange={update('phone')}
                  aria-invalid={!!fieldErrors.phone}
                  disabled={submitting}
                />
              </div>
              {fieldError('phone')}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <PasswordInput
                  id="password"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.password}
                  onChange={update('password')}
                  aria-invalid={!!fieldErrors.password}
                  disabled={submitting}
                />
                {fieldError('password')}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirm password</Label>
                <PasswordInput
                  id="confirmPassword"
                  autoComplete="new-password"
                  placeholder="••••••••"
                  value={form.confirmPassword}
                  onChange={update('confirmPassword')}
                  aria-invalid={!!fieldErrors.confirmPassword}
                  disabled={submitting}
                />
                {fieldError('confirmPassword')}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              At least {MIN_PASSWORD_LENGTH} characters, with letters and numbers.
            </p>

            <div className="space-y-2">
              <div className="flex items-start gap-2">
                <Checkbox
                  id="terms"
                  checked={acceptTerms}
                  onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                  aria-invalid={!!fieldErrors.terms}
                  disabled={submitting}
                  className="mt-0.5"
                />
                <Label htmlFor="terms" className="leading-snug font-normal">
                  I agree to the Terms of Service and Privacy Policy
                </Label>
              </div>
              {fieldError('terms')}
            </div>
          </form>
        </CardContent>

        <CardFooter className="flex-col gap-4">
          <Button type="submit" form="signup-form" className="w-full" disabled={submitting}>
            {submitting && <Loader2 className="animate-spin" />}
            {submitting ? 'Creating account…' : 'Create account'}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-foreground hover:underline">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </Card>
    </AuthLayout>
  )
}
