import {create} from 'zustand'
import {User} from "@/lib/client/types"

const initialUser: User = {
    id: '',
    name: '',
    bio: '',
    age: 20,
    gender: 'NON_BINARY' as any,
    icon: {
        id: 'initial_user',
        url: '/images/next.svg',
        status: 'ADOPTED',
        type: 'USER_ICON',
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaderId: '',
        userIconId: '',
        userBackgroundId: null,
        routeNodeId: null,
        routeThumbId: null,
    },
    background: {
        id: 'initial_user',
        url: '/images/next.svg',
        status: 'ADOPTED',
        type: 'USER_ICON',
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaderId: '',
        userIconId: null,
        userBackgroundId: '',
        routeNodeId: null,
        routeThumbId: null,
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
