'use client'

import FeaturedUserCard from '@/app/(public)/_components/ingredients/featuredUserCard'
import { User } from "@/lib/client/types"
import RouteCardGraphical from "@/app/_components/common/templates/routeCardGraphical";
import {UserCardGraphical} from "@/app/_components/common/templates/userCardGraphical";


type Props = {
  users: User[]
}

export default function TopUsersList(props: Props) {

  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center md:justify-end justify-start gap-2">
        <h2 className="text-sm font-semibold text-foreground-0">Top Users — This week</h2>
      </div>
      <div className="w-full md:h-[300px] sm:h-[800px] h-[900px] grid grid-rows-3 md:grid-rows-1 grid-cols-1 xl:grid-cols-6 lg:grid-cols-5 md:grid-cols-4 grid-cols-2 gap-3">
        <div className="col-span-2 order-1 md:order-5">
          <FeaturedUserCard user={props.users[0]}/>
        </div>
        <div className="col-span-1 block order-2 md:order-4">
          <UserCardGraphical user={props.users[1]} rank={2}/>
        </div>
        <div className="col-span-1 block order-3 md:order-3">
          <UserCardGraphical user={props.users[2]} rank={3}/>
        </div>
        <div className="col-span-1 block md:hidden lg:block order-4 md:order-2">
          <UserCardGraphical user={props.users[3]} rank={4}/>
        </div>
        <div className="col-span-1 block md:hidden xl:block order-5 md:order-1">
          <UserCardGraphical user={props.users[4]} rank={5}/>
        </div>
      </div>
    </div>
  )
}
