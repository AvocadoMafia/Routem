import CoverImage from '../ingredients/coverImage'
import UserAvatar from '../ingredients/userAvatar'
import { UserName, UserBio } from '../ingredients/profileInfo'
import ActionButtons, { ProfileMode } from '../ingredients/actionButtons'

export default function UserProfileHeader({
  name,
  bio,
  iconUrl,
  bgUrl,
  mode = 'public',
  followingId,
}: {
  name?: string
  bio?: string
  iconUrl?: string
  bgUrl?: string
  mode?: ProfileMode
  followingId?: string
}) {
  return (
    <>
      <CoverImage url={bgUrl} />
      <div className="w-full h-fit max-w-[1200px] mx-auto px-6">
        <div className="relative -mt-16 md:-mt-24 mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <UserAvatar url={iconUrl} name={name} />
            <div className="mb-2">
              <UserName name={name} />
            </div>
          </div>
          <ActionButtons mode={mode} followingId={followingId} />
        </div>
        
        {/* bio section - separated from name/avatar row to prevent pushing name up when bio is long */}
        <div className="mb-8">
          <UserBio bio={bio} />
        </div>
      </div>
    </>
  )
}
