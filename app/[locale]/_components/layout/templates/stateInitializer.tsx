"use client"

import {useEffect} from "react"
import {userStore} from "@/lib/stores/userStore";
import LocaleSync from "./localeSync";
import {createClient} from "@/lib/auth/supabase-client";
import {useShallow} from "zustand/react/shallow";
import { enumsStore } from "@/lib/stores/enumsStore";
import { exchangeRatesStore } from "@/lib/stores/exchangeRatesStore";

export default function StateInitializer() {

    const { userId, login, logout } = userStore(useShallow(state => ({ userId: state.user.id, login: state.login, logout: state.logout })))
    const fetchSearchEnums = enumsStore(state => state.fetchSearchEnums)
    const fetchUserEnums = enumsStore(state => state.fetchUserEnums)
    const fetchExchangeRates = exchangeRatesStore(state => state.fetchExchangeRates)

    useEffect(() => {
        fetchSearchEnums()
        fetchUserEnums()
        fetchExchangeRates()
    }, [fetchSearchEnums, fetchUserEnums, fetchExchangeRates])

    useEffect(() => {
        const supabase = createClient()
        const {
            data: { subscription },
        } = supabase.auth.onAuthStateChange((event, session) => {

            if (session) {
                // セッションがある場合、現在のユーザー情報が未取得、またはユーザーが切り替わった場合にログイン処理を行う
                // INITIAL_SESSION や SIGNED_IN イベントで発火することを期待
                if (userId === '' || userId !== session.user.id) {
                    login()
                }
            } else {
                // セッションがない場合、現在のユーザー情報が残っていればログアウト処理を行う
                if (userId !== '') {
                    logout()
                }
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [login, logout, userId])

    return <LocaleSync />
}
