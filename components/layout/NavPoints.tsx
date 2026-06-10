'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export function NavPoints() {
  const { data: session } = useSession()
  const [pts, setPts] = useState(0)

  useEffect(() => {
    if (!session) return
    fetch('/api/me')
      .then(r => r.json())
      .then(d => { if (d?.totalPoints !== undefined) setPts(d.totalPoints) })
  }, [session])

  if (!session) return null

  return (
    <div style={{ textAlign: 'right' }}>
      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-100)' }}>
        {session.user?.name?.split(' ')[0]}
      </div>
      <div style={{ fontSize: 10, color: 'var(--gold)', fontWeight: 700 }}>
        {pts} pts
      </div>
    </div>
  )
}
