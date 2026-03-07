"use client"

import {useCallback, useEffect} from "react"
import {userStore} from "@/lib/client/stores/userStore";
import {categoryStore} from "@/lib/client/stores/categoryStore";

export default function StateInitializer() {

    const login = userStore(state => state.login)
    const fetchCategories = categoryStore(state => state.fetchCategories)

    useEffect(() => {
        login()
        fetchCategories()
    }, [login, fetchCategories])

    return null
}
