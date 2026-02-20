import { MdSettings, MdInfoOutline } from 'react-icons/md'

export default function ActionButtons({ isOwnPage }: { isOwnPage: boolean }) {
  return (
    <div className="flex items-center gap-3 pb-2">
      {isOwnPage ? (
        <button className="flex items-center gap-2 bg-background-1 border border-grass px-4 py-2 rounded-xl font-bold hover:bg-grass transition-colors cursor-pointer shadow-sm">
          <MdSettings size={20} />
          <span>Edit Profile</span>
        </button>
      ) : (
        <>
          <button className="bg-accent-1 text-background-1 px-8 py-2.5 rounded-xl font-bold hover:opacity-90 transition-opacity cursor-pointer shadow-md shadow-accent-1/20">
            Follow
          </button>
          <button className="p-2.5 bg-background-1 border border-grass rounded-xl hover:bg-grass transition-colors cursor-pointer">
            <MdInfoOutline size={22} className="text-foreground-1" />
          </button>
        </>
      )}
    </div>
  )
}
