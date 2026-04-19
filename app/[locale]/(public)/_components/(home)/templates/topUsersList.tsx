'use client'

import FeaturedUserCard from '@/app/[locale]/(public)/_components/(home)/ingredients/featuredUserCard'
import { User } from "@/lib/types/domain"
import {UserCardGraphical} from "@/app/[locale]/_components/common/templates/userCardGraphical";
import SectionErrorState from '@/app/[locale]/_components/common/ingredients/sectionErrorState'
import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { getDataFromServerWithJson, toErrorScheme } from "@/lib/client/helpers";
import { ErrorScheme } from "@/lib/types/error";


export default function TopUsersList() {
  const tHome = useTranslations('home');
  const [users, setUsers] = useState<User[] | null>(null);
  const [error, setError] = useState<ErrorScheme | null>(null);

  const fetchUsers = useCallback(async () => {
    setError(null);
    try {
      const res = await getDataFromServerWithJson<User[]>('/api/v1/users?limit=5');
      if (res) setUsers(res);
    } catch (err) {
      console.error("Failed to fetch top users:", err);
      setError(toErrorScheme(err));
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // --- error ---
  if (error && !users) {
    return (
      <div className="w-full h-fit">
        <div className="w-full mb-3 flex items-center md:justify-end justify-start gap-2">
          <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topUsers')}</h2>
        </div>
        <SectionErrorState error={error} onRetry={fetchUsers} />
      </div>
    );
  }

  // --- loading ---
  if (!users) return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center md:justify-end justify-start gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topUsers')}</h2>
      </div>
      <div className="w-full lg:h-[350px] md:h-[700px] sm:h-[1000px] h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1 [direction:rtl]">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="w-full h-full bg-background-1 animate-pulse rounded-2xl" />
        ))}
      </div>
    </div>
  );

  if (users.length < 5) return null;

  return (
    <div className="w-full h-fit">
      <div className="w-full mb-3 flex items-center md:justify-end justify-start gap-2">
        <h2 className="text-md font-bold uppercase tracking-[0.3em] text-foreground-0">{tHome('topUsers')}</h2>
      </div>
        <div className="w-full lg:h-[350px] md:h-[700px] sm:h-[1000px] h-[1400px] grid gap-3 xl:grid-rows-1 xl:grid-cols-5 lg:grid-rows-1 lg:grid-cols-4 md:grid-rows-2 md:grid-cols-3 sm:grid-rows-3 sm:grid-cols-2 grid-rows-5 grid-cols-1 [direction:rtl]">
            <div className="sm:col-span-2 col-span-1 [direction:ltr]">
                <FeaturedUserCard user={users[0]} isLinkCard={true}/>
            </div>
            <div className="col-span-1 block [direction:ltr]">
                <UserCardGraphical user={users[1]} rank={2}/>
            </div>
            <div className="col-span-1 block [direction:ltr]">
                <UserCardGraphical user={users[2]} rank={3}/>
            </div>
            <div className="col-span-1 sm:col-span-1 md:col-span-2 xl:col-span-1 block lg:hidden xl:block [direction:ltr]">
                <UserCardGraphical user={users[3]} rank={4}/>
            </div>
            <div className="col-span-1 block md:hidden [direction:ltr]">
                <UserCardGraphical user={users[4]} rank={5}/>
            </div>
        </div>
    </div>
  )
}
