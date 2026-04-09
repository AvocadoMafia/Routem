import CoverImage from '../ingredients/coverImage'
import UserAvatar from '../ingredients/userAvatar'
import { UserName, UserBio } from '../ingredients/profileInfo'
import ActionButtons from '../ingredients/actionButtons'

export default function UserProfileHeader({
  name,
  bio,
  iconUrl,
  bgUrl,
}: {
  name?: string
  bio?: string
  iconUrl?: string
  bgUrl?: string
}) {
  return (
    <>
      <CoverImage url={bgUrl} />
      <div className="w-full h-fit max-w-[1200px] mx-auto px-6 relative">
        <div className="relative -mt-16 md:-mt-24 mb-4 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <UserAvatar url={iconUrl} name={name} />
            <div className="mb-2">
              <UserName name={name} />
            </div>
          </div>
        </div>
        
        {/* bio and actions section */}
        <div className="mb-8 flex flex-col md:flex-row md:items-start md:justify-between gap-4">
          <div className="max-w-[800px]">
            <UserBio bio={bio} />
          </div>
          <ActionButtons />
        </div>
      </div>
    </>
  )
}
