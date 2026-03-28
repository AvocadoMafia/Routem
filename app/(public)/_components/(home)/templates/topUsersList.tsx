'use client'

import FeaturedUserCard from '@/app/(public)/_components/(home)/ingredients/featuredUserCard'
import { User } from "@/lib/client/types"
import {UserCardGraphical} from "@/app/_components/common/templates/userCardGraphical";


type Props = {
  users: User[]
}

export default function TopUsersList(props: Props) {

  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center md:justify-end justify-start gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">Top Users — This week</h2>
      </div>
        <div className="w-full lg:h-[350px] md:h-[700px] sm:h-[1000px] h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1">
            <div className="sm:col-span-2 col-span-1">
                <FeaturedUserCard user={props.users[0]} isLinkCard={true}/>
            </div>
            <div className="col-span-1 block">
                <UserCardGraphical user={props.users[1]} rank={2}/>
            </div>
            <div className="col-span-1 block">
                <UserCardGraphical user={props.users[2]} rank={3}/>
            </div>
            <div className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-1 block lg:hidden xl:block">
                <UserCardGraphical user={props.users[3]} rank={4}/>
            </div>
            <div className="col-span-1 block md:hidden">
                <UserCardGraphical user={props.users[4]} rank={5}/>
            </div>
        </div>
    </div>
  )
}
