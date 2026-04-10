'use client'

import {getDataFromServerWithJson} from "@/lib/client/helpers";
import {useEffect, useState} from "react";

export default function Page() {

    const [value, setValue] = useState<string | null>(null)

    useEffect(() => {
        getDataFromServerWithJson<{success: boolean, value:string}>('/api/v1/redis-test').then(res => {
            if(res) {
                setValue(res.value)
            }
        })

    }, []);

    return (
        <div>
            <h1>this is redis-test page</h1>
            <p>{value}</p>
        </div>
    )
}