import {prisma} from "@/lib/prisma";
          


export const usersRepository = {
  findById: async (id: string) => {
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  },
};