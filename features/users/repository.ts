import {prisma} from "@/lib/prisma";
import {getPrisma} from "@/lib/config/server";
          


export const usersRepository = {
  findById: async (id: string) => {
    const user = await getPrisma().user.findUnique({
      where: { id: id },
    });

    return user;
  },
};