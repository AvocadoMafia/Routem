"use client"

import {useEffect} from "react"
import {userStore} from "@/lib/client/stores/userStore";
import LocaleSync from "./localeSync";

export default function StateInitializer() {

    const login = userStore(state => state.login)

    useEffect(() => {
        login()
    }, [login])

    return <LocaleSync />
}
