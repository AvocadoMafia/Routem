'use client'

import PageTitle from "@/app/_components/layout/ingredients/pageTitle";
import NavigatorList from "@/app/_components/layout/ingredients/navigatorList";

export default function Header () {

    return (
        <header
            className={`block sticky top-0 w-full h-[50px] md:h-[60px] bg-background-1 box-border z-100`}
        >
            <div className={'px-4 w-full h-full flex md:justify-around justify-between items-center'}>
                <PageTitle />
                <NavigatorList/>
            </div>
        </header>
    )
}
