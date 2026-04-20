"use client";

import { Route } from "@/lib/types/domain";
import Image from "next/image";
import {
  HiClock,
  HiBanknotes,
} from "react-icons/hi2";
import { motion } from "framer-motion";
import LikeButton from "./likeButton";
import { User } from "@supabase/supabase-js";
import { useTranslations } from "next-intl";
import { useLocalizedBudget } from "@/lib/hooks/useLocalizedBudget";
import { getIsLikedByMe } from "@/lib/hooks/useLike";
import RouteManagementActions from "./routeManagementActions";

type RouteHeaderProps = {
  route: Route;
  currentUser?: User | null;
};

export default function RouteHeader({ route, currentUser }: RouteHeaderProps) {
  const t = useTranslations("routes");
  const tEditor = useTranslations("routeEditor");
  const localizedBudget = useLocalizedBudget(route.budget?.amount, route.budget?.localCurrencyCode, "3,500");

  const routeDate = route.date ? new Date(route.date) : null;
  const daysCount = route.routeDates.length;
  const formattedDuration = `${daysCount} ${t("daysUnit")}`;

  const author = route.author;
  const isAuthor = currentUser?.id === route.authorId;
  const isCollaborator = route.collaborators?.some((c) => c.userId === currentUser?.id);
  const canEdit = isAuthor || (isCollaborator && route.collaboratorPolicy === "CAN_EDIT");


  return (
    <div className="flex flex-col border-b py-8 border-grass">
      <div className="flex flex-col md:flex-row sm:gap-3 gap-6 md:gap-10 items-start">
        {/*画像表示部*/}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative w-full md:w-2/5 aspect-video md:aspect-[16/10] rounded-2xl overflow-hidden shadow-xl shrink-0"
        >
          <Image
            src={route.thumbnail?.url || "/mockImages/Kyoto.jpg"}
            alt={route.title}
            fill
            className="object-cover"
            priority
            unoptimized
          />
        </motion.div>
        <div className={"flex flex-col gap-3 flex-1 md:py-3 md:px-0 px-3 py-0"}>
          {/*なるべくタイトルのクランプはしたくないが、とんでも長いタイトルを持つ記事への対策*/}
          <div className={"flex flex-col gap-1"}>
            <h1 className={"md:text-3xl text-xl font-bold text-foreground-0 line-clamp-3"}>{route.title}</h1>
            <p className={"text-sm text-foreground-1"}>{}</p>
          </div>
          <div className={"flex gap-2 items-center"}>
            <img className={"md:w-10 w-7 md:h-10 h-7 rounded-full"} src={route.author.icon?.url || "/mockImages/author.png"} alt={"author"} />
            <span className={"text-foreground-0 text-lg"}>{route.author.name}</span>
          </div>
        </div>


      </div>

      <RouteManagementActions
        route={route}
        currentUser={currentUser}
        isAuthor={isAuthor}
        isCollaborator={isCollaborator}
        canEdit={canEdit}
      />
    </div>
  );
}
