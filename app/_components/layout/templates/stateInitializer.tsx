"use client"

import {useCallback, useEffect} from "react"
import {userStore} from "@/lib/client/stores/userStore";

export default function StateInitializer() {

    const login = userStore(state => state.login)

    useEffect(() => {
        login()
    }, [login])

    return null
}
