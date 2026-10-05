'use client'

import { Building2 } from 'lucide-react'
import type { User } from '@supabase/supabase-js'
import { useSessionUser } from '@/lib/hooks/use-session-user'

export type TopbarUser = {
  name: string
  role?: string
  organization?: string
}

function initials(name: string) {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join('')
}

function readMeta(user: User, ...keys: string[]) {
  const meta = user.user_metadata ?? {}
  for (const key of keys) {
    const value = meta[key]
    if (typeof value === 'string' && value.trim()) return value.trim()
  }
  return undefined
}

function toTopbarUser(user: User): TopbarUser {
  return {
    name: readMeta(user, 'full_name', 'name') ?? user.email?.split('@')[0] ?? 'Usuario',
    role: readMeta(user, 'role', 'job_title'),
    organization: readMeta(user, 'organization', 'company', 'plan_name'),
  }
}

export function PayerTopbar() {
  const { user: sessionUser } = useSessionUser()
  const user = sessionUser ? toTopbarUser(sessionUser) : null

  return (
    <div className="flex min-h-[73px] items-center justify-between gap-4 border-b border-slate-200 bg-white px-6 py-4 md:px-8">
      <div className="flex min-w-0 items-center gap-3 text-ink">
        {user?.organization ? (
          <>
            <Building2 className="size-5 shrink-0 text-slate-500" aria-hidden="true" />
            <p className="truncate text-base font-semibold">{user.organization}</p>
          </>
        ) : null}
      </div>
      {user ? (
        <div className="flex items-center gap-3">
          <div className="hidden text-right sm:block">
            <p className="text-base font-semibold leading-5 text-ink">{user.name}</p>
            {user.role ? <p className="text-sm leading-5 text-slate-500">{user.role}</p> : null}
          </div>
          <span
            aria-hidden="true"
            className="flex size-10 items-center justify-center rounded-full bg-brand text-sm font-semibold text-white"
          >
            {initials(user.name)}
          </span>
        </div>
      ) : null}
    </div>
  )
}
