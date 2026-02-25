
import {getPrisma} from "@/lib/config/server";
import {UpdateUserType} from "@/features/users/schema";
          


export const usersRepository = {
  findById: async (id: string) => {
    const user = await getPrisma().user.findUnique({
      where: { id: id },
    });

    return user;
  },

  updateUser: async (id: string, data: UpdateUserType) => {
    const safeIconUrl = data.icon;
    const user = await getPrisma().user.update({
      where: { id: id },
      data: {
        name: data.name,
        bio: data.bio,
        ...(data.icon && {
          icon: {
            create: {
              url: data.icon,
              status: 'ADOPTED',
              type: 'USER_ICON',
              createdAt: new Date(),
              updatedAt: new Date(),
              uploaderId: id,
            }
          },
        }),
        ...(data.background && {
          background: {
            create: {
              url: data.background,
              status: 'ADOPTED',
              type: 'USER_BG',
              createdAt: new Date(),
              updatedAt: new Date(),
              uploaderId: id,
            }
          }
        })
      }
    });

    return user;
  }
};