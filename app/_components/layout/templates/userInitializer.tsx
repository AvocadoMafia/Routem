"use client"

import { useEffect } from "react"
import {userStore} from "@/lib/client/stores/userStore";
import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {User} from "@/lib/client/types";

export default function UserInitializer() {

    const setUser = userStore(state => state.setUser)

    useEffect(() => {
        const fetchUser = async () => {
            const user = await getDataFromServerWithJson<User>('/api/v1/users/me')

            console.log(user)

            if (user && 'id' in user) {
                setUser(user)
            }
        }

        fetchUser()
    }, [setUser])

    return null
}
