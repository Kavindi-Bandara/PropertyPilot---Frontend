import { LogOut, ShieldCheck } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useAuth } from '@/hooks/useAuth'

// Placeholder — property management (add / edit / delete) will be built here.
export default function AdminDashboard() {
  const { user, logout } = useAuth()

  return (
    <div className="mx-auto max-w-5xl space-y-6 p-6">
      <header className="flex items-center justify-between">
        <h1 className="flex items-center gap-2 text-2xl font-bold">
          <ShieldCheck className="size-6 text-emerald-600" />
          Admin Dashboard
        </h1>
        <Button variant="outline" onClick={logout}>
          <LogOut />
          Logout
        </Button>
      </header>
      <p className="text-muted-foreground">Signed in as {user?.name ?? user?.email}.</p>
    </div>
  )
}
