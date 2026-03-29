export default function ProfileStats({ routes, followers, following }: { routes: number; followers: number | string; following: number | string }) {
  return (
    <div className="flex items-center gap-8 mb-10 py-4">
      <div className="flex items-center gap-2">
        <span className="text-xl font-bold text-foreground-0">{routes}</span>
        <span className="text-foreground-1">Routes</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
        <span className="text-xl font-bold text-foreground-0">{followers}</span>
        <span className="text-foreground-1">Followers</span>
      </div>
      <div className="flex items-center gap-2 cursor-pointer hover:opacity-70 transition-opacity">
        <span className="text-xl font-bold text-foreground-0">{following}</span>
        <span className="text-foreground-1">Following</span>
      </div>
    </div>
  )
}
