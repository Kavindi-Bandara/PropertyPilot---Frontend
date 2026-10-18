import type { ReactNode } from 'react'
import { Building2, Car, Home, MapPin } from 'lucide-react'

const categories = [
  { icon: MapPin, label: 'Land' },
  { icon: Home, label: 'Houses' },
  { icon: Car, label: 'Vehicles' },
  { icon: Building2, label: 'Commercial' },
]

/** Full-screen dark background with the auth card floating on top. Shared by Login and Sign Up. */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="relative min-h-svh overflow-hidden bg-zinc-950 text-white">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-600/40 via-zinc-900 to-zinc-950" />

      <div className="relative mx-auto grid min-h-svh max-w-6xl items-center gap-12 px-4 py-10 lg:grid-cols-2 lg:px-10">
        {/* Brand content (large screens only) */}
        <section className="hidden space-y-6 lg:block">
          <div className="flex items-center gap-2 text-lg font-semibold">
            <Building2 className="size-6" />
            PropertyPilot
          </div>
          <h1 className="text-4xl leading-tight font-bold">
            Find, buy and sell
            <br />
            properties with confidence.
          </h1>
          <p className="max-w-md text-zinc-300">
            Browse land, houses, vehicles and more — all in one place, with full details on every
            listing.
          </p>
          <div className="grid max-w-md grid-cols-2 gap-3">
            {categories.map(({ icon: Icon, label }) => (
              <div
                key={label}
                className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/5 px-4 py-3 backdrop-blur"
              >
                <Icon className="size-5 text-emerald-400" />
                <span className="text-sm">{label}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Card */}
        <div className="mx-auto w-full max-w-md space-y-6 text-foreground lg:mr-0">
          <div className="flex items-center justify-center gap-2 text-lg font-semibold text-white lg:hidden">
            <Building2 className="size-6 text-emerald-400" />
            PropertyPilot
          </div>
          <div className="[&>[data-slot=card]]:shadow-2xl">{children}</div>
        </div>
      </div>
    </div>
  )
}
