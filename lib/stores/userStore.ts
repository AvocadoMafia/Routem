import {create} from 'zustand'
import { User } from "@/lib/types/domain"
import { ErrorScheme } from "@/lib/types/error"
import {getDataFromServerWithJson, patchDataToServerWithJson, toErrorScheme} from "@/lib/api/client";
import {createClient} from "@/lib/auth/supabase-client";
import {ImageStatus, ImageType, Language, Locale} from "@prisma/client";

const initialUser: User = {
    id: '',
    name: '',
    bio: '',
    locale: Locale.JA,
    language: Language.JA,
    age: 20,
    icon: {
        id: 'initial_user',
        url: '/images/next.svg',
        key: null,
        status: ImageStatus.ADOPTED,
        type: ImageType.USER_ICON,
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
        key: null,
        status: ImageStatus.ADOPTED,
        type: ImageType.USER_BG,
        createdAt: new Date(),
        updatedAt: new Date(),
        uploaderId: '',
        userIconId: null,
        userBackgroundId: '',
        routeNodeId: null,
        routeThumbId: null,
    },
    uploadedImages: [],
    likes: [],
    _count: {
        routes: 0,
        followings: 0,
        followers: 0
    }
}

type StoreConfig = {
    user: User
    //ユーザー情報の取得、及びその値のセットはzustandに一任し、副作用として引数に指定した関数を発火する。
    //zustand内部の情報の操作を担当する関数では、一貫して三つの関数onStart、onSuccess、onFailureを用意する。
    //onStartにはfetch等での戻り値を、onFailureにはerrorをErrorSchemeにキャストしたものを引数としてoptionalで渡す。
    login: (onStart?: () => void, onSuccess?: (user?: User) => void, onFailure?: (error?: ErrorScheme) => void) => Promise<void>,
    edit: (profile: {name?: string, bio?:string, background?: string, icon?: string, locale?: User["locale"], language?: User["language"]}, onStart?: () => void, onSuccess?: (user?: User) => void, onFailure?: (error?: ErrorScheme) => void) => Promise<void>,
    logout: (onStart?: () => void, onSuccess?: () => void, onFailure?: (error?: ErrorScheme) => void) => Promise<void>
}

export const userStore = create<StoreConfig>((set) => (
    {
        user: initialUser,
        login: async (onStart, onSuccess, onFailure) => {
            onStart && onStart()

            try {
                const user = await getDataFromServerWithJson<User>('/api/v1/users/me')

                if(user && 'id' in user) {
                    set({user})
                    onSuccess && onSuccess(user)
                }
            }catch(e) {
                //エラーハンドリング処理を書く
                onFailure && onFailure(toErrorScheme(e))
            }
        },
        edit: async (profile, onStart, onSuccess, onFailure) => {
            onStart && onStart()

            try {
                const user = await patchDataToServerWithJson<User>('/api/v1/users/me', profile)

                if(user && 'id' in user) {
                    set({user})
                    onSuccess && onSuccess(user)
                }
            }catch(e) {
                //エラーハンドリング処理を書く
                onFailure && onFailure(toErrorScheme(e))
            }
        },
        logout: async (onStart, onSuccess, onFailure) => {
            onStart && onStart()

            try {
                const supabase = createClient()
                const { data: { session } } = await supabase.auth.getSession()

                if (session) {
                    const {error} = await supabase.auth.signOut()
                    if (error) throw error
                }

                set({user: initialUser})
                onSuccess && onSuccess()
            } catch (e) {
                onFailure && onFailure(toErrorScheme(e))
            }
        },
    }
))
