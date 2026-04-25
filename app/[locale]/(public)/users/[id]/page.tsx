import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { usersService } from '@/features/users/service'
import { createClient } from '@/lib/auth/supabase-server'
import { headers } from 'next/headers'
import { buildMetadata } from '@/lib/utils/metadata'
import RootClient from './rootClient'

type Props = {
  params: Promise<{ id: string }>
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params
  try {
    const user = await usersService.getUserById(id)
    return buildMetadata({
      title: user.name,
      description: user.bio || `Check out ${user.name}'s profile on Routem`,
      image: user.icon?.url,
      path: `/users/${id}`,
      type: 'profile',
    })
  } catch (e) {
    return buildMetadata({ title: 'User Not Found' })
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
