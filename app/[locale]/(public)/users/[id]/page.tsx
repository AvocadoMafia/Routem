import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { usersService } from '@/features/users/service'
import { createClient } from '@/lib/auth/supabase/server'
import { headers } from 'next/headers'
import RootClient from './rootClient'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const user = await usersService.getUserById(id)
    return {
      title: `${user.name} | Rootem`,
      description: user.bio || `Check out ${user.name}'s profile on Rootem`,
      openGraph: {
        title: user.name,
        description: user.bio || `Check out ${user.name}'s profile on Rootem`,
        images: user.icon?.url ? [user.icon.url] : [],
      },
    }
  } catch (e) {
    return {
      title: 'User Not Found',
    }
  }
}

export default async function UserPage({ params }: Props) {
  const { id } = await params
  const headersList = await headers()

  const supabase = await createClient({
    headers: headersList,
  } as any)

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser()

  try {
    const targetUser = await usersService.getUserById(id, currentUser?.id)
    return (
      <RootClient targetUser={targetUser as any} currentUser={currentUser} />
    )
  } catch (e) {
    notFound()
  }
}
