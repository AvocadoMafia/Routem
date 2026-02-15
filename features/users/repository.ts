import { getPrisma } from "@/lib/config/server";



export const usersRepository = {
  findById: async (id: string) => {
    const prisma = getPrisma();
    const user = await prisma.user.findUnique({
      where: { id: id },
    });

    return user;
  },
};