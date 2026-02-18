import {create} from 'zustand'
import {User} from "@/lib/client/types"

const initialUser: User = {
    id: '',
    name: '',
    bio: '',
    age: 20,
    gender: 'NON_BINARY',
    profileIcon: {
        id: 'initial_user',
        url: '/images/next.svg',
        status: 'ADOPTED',
        type: 'USER_PROFILE',
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaderId: string | null,
        routeNodeId: string | null,
        userProfileId: string | null,
        routeThumbId: string | null,
    },
    uploadedImages: [],
    routes: [],
    likes: []
}

type StoreConfig = {
    user: User
    setUser: (user: User) => void
}

export const userStore = create<StoreConfig>((set) => (
    {
        user: initialUser,
        setUser: (user: User) => {set({user})}
    }
))
